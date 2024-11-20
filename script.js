let stopRequested = false;
let activeTimers = []; // Array to store active timers

function resetState() {
    // Re-enable buttons and reset the phase indicator
    document.getElementById('start-timer-btn').disabled = false;
    document.getElementById('stop-timer-btn').disabled = true;
    stopRequested = false;

    // Stop all active timers
    activeTimers.forEach((timer) => clearTimeout(timer));
    activeTimers = []; // Clear the timers array

    // Reset UI elements
    document.getElementById('phase-indicator').textContent = 'Ready';
    const circle = document.querySelector('.circle');
    circle.style.transitionDuration = '1s'; // Reset animation duration
    circle.style.transform = 'scale(1)'; // Reset circle to original size
}

document.getElementById('start-timer-btn').addEventListener('click', () => {
    const numBreaths = parseInt(document.getElementById('num-breaths').value, 10);
    const retentionDuration = parseInt(document.getElementById('retention-duration').value, 10);
    const recoveryHold = parseInt(document.getElementById('recovery-hold').value, 10);
    const gapBetweenRounds = parseInt(document.getElementById('gap-between-rounds').value, 10);
    const numRounds = parseInt(document.getElementById('num-rounds').value, 10);
    const inhaleDuration = parseInt(document.getElementById('inhale-duration').value, 10);
    const exhaleDuration = parseInt(document.getElementById('exhale-duration').value, 10);

    const phaseIndicator = document.getElementById('phase-indicator');
    const circle = document.querySelector('.circle');

    document.getElementById('start-timer-btn').disabled = true;
    document.getElementById('stop-timer-btn').disabled = false;
    stopRequested = false;

    let currentRound = 1;

    function startBreathingCycle() {
        if (stopRequested || (numRounds !== 0 && currentRound > numRounds)) {
            phaseIndicator.textContent = stopRequested ? "Stopped" : "Session Complete!";
            resetState();
            return;
        }

        let breaths = 0;

        function inhaleExhale() {
            if (stopRequested) return;

            if (numBreaths !== 0 && breaths < numBreaths) {
                // Inhale
                phaseIndicator.textContent = `Inhale (${inhaleDuration}s) - Breath ${breaths + 1}/${numBreaths}`;
                circle.style.transitionDuration = `${inhaleDuration}s`;
                circle.style.transform = 'scale(1.5)';
                activeTimers.push(
                    setTimeout(() => {
                        // Exhale
                        phaseIndicator.textContent = `Exhale (${exhaleDuration}s)`;
                        circle.style.transitionDuration = `${exhaleDuration}s`;
                        circle.style.transform = 'scale(1)';
                        breaths++;
                        activeTimers.push(setTimeout(inhaleExhale, exhaleDuration * 1000));
                    }, inhaleDuration * 1000)
                );
            } else {
                retentionPhase();
            }
        }

        function retentionPhase() {
            if (stopRequested) return;
            if (retentionDuration > 0) {
                phaseIndicator.textContent = `Hold (${retentionDuration}s)`;
                circle.style.transform = 'scale(1)';
                activeTimers.push(
                    setTimeout(() => {
                        recoveryPhase();
                    }, retentionDuration * 1000)
                );
            } else {
                recoveryPhase();
            }
        }

        function recoveryPhase() {
            if (stopRequested) return;
            if (recoveryHold > 0) {
                phaseIndicator.textContent = `Recovery (${recoveryHold}s)`;
                circle.style.transform = 'scale(1)';
                activeTimers.push(
                    setTimeout(() => {
                        gapPhase();
                    }, recoveryHold * 1000)
                );
            } else {
                gapPhase();
            }
        }

        function gapPhase() {
            if (stopRequested) return;
            if (gapBetweenRounds > 0) {
                phaseIndicator.textContent = `Rest (${gapBetweenRounds}s)`;
                circle.style.transform = 'scale(1)';
                activeTimers.push(
                    setTimeout(() => {
                        currentRound++;
                        startBreathingCycle();
                    }, gapBetweenRounds * 1000)
                );
            } else {
                currentRound++;
                startBreathingCycle();
            }
        }

        inhaleExhale();
    }

    startBreathingCycle();
});

document.getElementById('stop-timer-btn').addEventListener('click', () => {
    stopRequested = true;
    resetState();
});

const presetDescriptions = {
    "30,90,15,15,3,3,3": {
        name: "Wim Hof Method (WHM)",
        whatToExpect: "A powerful breathing technique that improves focus, resilience, and oxygenation through deep, fast-paced breaths followed by breath retention.",
        whatToDo: "Take 30 full breaths quickly. Then exhale completely and hold your breath for 90 seconds (or as long as comfortable). After holding, inhale deeply, hold for 15 seconds, and then exhale. Repeat this process for 3 rounds."
    },
    "0,5,5,10,4,5,5": {
        name: "Box Breathing",
        whatToExpect: "A calming technique that promotes relaxation and focus by evenly pacing your breaths and breath holds.",
        whatToDo: "Inhale through your nose for 5 seconds, hold your breath for 5 seconds, exhale slowly for 5 seconds, and hold again for 5 seconds. Repeat this cycle for 4 rounds or more."
    },
    "30,0,0,10,0,6,6": {
        name: "Coherent Breathing",
        whatToExpect: "A slow, steady breathing practice that helps regulate heart rate and reduce stress by focusing on equal inhale and exhale durations.",
        whatToDo: "Inhale through your nose for 6 seconds and exhale slowly through your nose for 6 seconds. Continue this rhythm for 5-10 minutes, focusing on deep, even breaths."
    },
    "8,7,0,10,3,4,8": {
        name: "4-7-8 Breathing",
        whatToExpect: "A relaxation method that reduces anxiety and aids sleep by extending your exhale and slowing your breath.",
        whatToDo: "Inhale deeply through your nose for 4 seconds, hold your breath for 7 seconds, and exhale fully through your mouth for 8 seconds. Repeat this cycle for 3-4 rounds or until you feel calm."
    },
    "30,60,15,20,3,3,3": {
        name: "Tummo Breathing",
        whatToExpect: "A practice that generates internal heat and improves mental clarity through rapid breathing and controlled breath retention.",
        whatToDo: "Take 30 deep, fast breaths, then exhale completely and hold your breath for 60 seconds (or as long as comfortable). Inhale deeply, hold for 15 seconds, and then exhale. Repeat this cycle for 3 rounds."
    },
    "20,0,0,10,2,3,6": {
        name: "2:1 Ratio Breathing",
        whatToExpect: "A relaxation technique that encourages calmness and reduces tension by extending your exhale relative to your inhale.",
        whatToDo: "Inhale deeply through your nose for 3 seconds, then exhale slowly through your mouth for 6 seconds. Repeat this breathing pattern for 2-3 rounds or until fully relaxed."
    }
};

// Event listener for preset selection
document.getElementById('preset-selector').addEventListener('change', (event) => {
    const presetValue = event.target.value;
    const preset = presetDescriptions[presetValue];
    const descriptionDiv = document.getElementById('preset-description');

    if (preset) {
        descriptionDiv.innerHTML = `
            <p><strong>${preset.name}</strong></p>
            <p><strong>What to Expect:</strong> ${preset.whatToExpect}</p>
            <p><strong>What to Do:</strong> ${preset.whatToDo}</p>
        `;
    }

    // Apply preset values to the inputs
    const [numBreaths, retentionDuration, recoveryHold, gapBetweenRounds, numRounds, inhaleDuration, exhaleDuration] =
        presetValue.split(',').map(Number);

    document.getElementById('num-breaths').value = numBreaths;
    document.getElementById('retention-duration').value = retentionDuration;
    document.getElementById('recovery-hold').value = recoveryHold;
    document.getElementById('gap-between-rounds').value = gapBetweenRounds;
    document.getElementById('num-rounds').value = numRounds;
    document.getElementById('inhale-duration').value = inhaleDuration;
    document.getElementById('exhale-duration').value = exhaleDuration;
});

// Toggle the accordion for the "Customize" section
document.getElementById('customize-toggle').addEventListener('click', () => {
    const settingsDiv = document.getElementById('customize-settings');
    const toggleButton = document.getElementById('customize-toggle');

    // Check if the settings are currently expanded
    if (settingsDiv.classList.contains('expanded')) {
        settingsDiv.classList.remove('expanded'); // Collapse
        toggleButton.textContent = 'Customize'; // Update button text
    } else {
        settingsDiv.classList.add('expanded'); // Expand
        toggleButton.textContent = 'Hide Customize'; // Update button text
    }
});
