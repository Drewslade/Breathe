let stopRequested = false;
let activeTimers = []; // Array to store active timers

function resetState() {
    // Re-enable buttons and reset the phase indicator
    document.getElementById('start-timer-btn').disabled = false;
    document.getElementById('stop-timer-btn').disabled = true;
    stopRequested = false;
    activeTimers.forEach((timer) => clearTimeout(timer)); // Clear all active timers
    activeTimers = []; // Reset the timers array
    document.getElementById('phase-indicator').textContent = 'Ready';
    const circle = document.querySelector('.circle');
    circle.style.transitionDuration = '1s'; // Reset transition duration
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
                // Inhale phase
                phaseIndicator.textContent = `Inhale (${inhaleDuration}s) - Breath ${breaths + 1}/${numBreaths}`;
                circle.style.transitionDuration = `${inhaleDuration}s`; // Set animation duration for inhale
                circle.style.transform = 'scale(1.5)';
                activeTimers.push(
                    setTimeout(() => {
                        // Exhale phase
                        phaseIndicator.textContent = `Exhale (${exhaleDuration}s)`;
                        circle.style.transitionDuration = `${exhaleDuration}s`; // Set animation duration for exhale
                        circle.style.transform = 'scale(1)';
                        breaths++;
                        activeTimers.push(setTimeout(inhaleExhale, exhaleDuration * 1000));
                    }, inhaleDuration * 1000)
                );
            } else {
                // After breaths, move to the retention phase
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

        inhaleExhale(); // Start with the inhale/exhale cycle
    }

    startBreathingCycle();
});

document.getElementById('stop-timer-btn').addEventListener('click', () => {
    stopRequested = true;
    resetState(); // Reset state when Stop is clicked
});

document.getElementById('preset-selector').addEventListener('change', (event) => {
    const [numBreaths, retentionDuration, recoveryHold, gapBetweenRounds, numRounds, inhaleDuration, exhaleDuration] =
        event.target.value.split(',').map(Number);

    document.getElementById('num-breaths').value = numBreaths;
    document.getElementById('retention-duration').value = retentionDuration;
    document.getElementById('recovery-hold').value = recoveryHold;
    document.getElementById('gap-between-rounds').value = gapBetweenRounds;
    document.getElementById('num-rounds').value = numRounds;
    document.getElementById('inhale-duration').value = inhaleDuration;
    document.getElementById('exhale-duration').value = exhaleDuration;
});
