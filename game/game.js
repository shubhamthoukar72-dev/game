"use strict";

const MIN_NUMBER = 1;
const MAX_NUMBER = 100;
const MAX_ATTEMPTS = 8;

const form = document.querySelector("#guess-form");
const input = document.querySelector("#guess-input");
const feedback = document.querySelector("#feedback");
const triesLeft = document.querySelector("#tries-left");
const attemptFill = document.querySelector("#attempt-fill");
const attemptProgress = document.querySelector(".attempt-track");
const history = document.querySelector("#guess-history");
const guessTotal = document.querySelector("#guess-total");
const newGameButton = document.querySelector("#new-game");

let secretNumber;
let attemptsUsed;
let isGameOver;
let previousGuesses;

function startNewGame() {
  secretNumber = Math.floor(Math.random() * (MAX_NUMBER - MIN_NUMBER + 1)) + MIN_NUMBER;
  attemptsUsed = 0;
  isGameOver = false;
  previousGuesses = new Set();

  form.reset();
  input.disabled = false;
  form.querySelector("button[type='submit']").disabled = false;
  triesLeft.textContent = String(MAX_ATTEMPTS);
  attemptFill.style.width = "100%";
  attemptFill.style.background = "";
  attemptProgress.setAttribute("aria-valuenow", String(MAX_ATTEMPTS));
  history.replaceChildren();

  const emptyMessage = document.createElement("span");
  emptyMessage.className = "history-empty";
  emptyMessage.textContent = "Your guesses will show up here";
  history.append(emptyMessage);

  guessTotal.textContent = "0 guesses";
  setFeedback("Ready when you are. Pick your first number!", "ready");
  input.focus();
}

function setFeedback(message, state) {
  feedback.dataset.state = state;
  feedback.lastChild.textContent = message;
}

function addGuessToHistory(guess, isCorrect) {
  if (attemptsUsed === 1) {
    history.replaceChildren();
  }

  const chip = document.createElement("span");
  chip.className = "guess-chip";
  chip.dataset.result = isCorrect ? "correct" : "incorrect";
  chip.textContent = String(guess);
  chip.setAttribute("aria-label", isCorrect ? `${guess}, correct` : String(guess));
  history.append(chip);

  const label = attemptsUsed === 1 ? "guess" : "guesses";
  guessTotal.textContent = `${attemptsUsed} ${label}`;
}

function submitGuess(event) {
  event.preventDefault();
  if (isGameOver) {
    return;
  }

  const rawGuess = input.value.trim();
  const guess = Number(rawGuess);
  if (rawGuess === "" || !Number.isInteger(guess) || guess < MIN_NUMBER || guess > MAX_NUMBER) {
    setFeedback(`Enter a whole number from ${MIN_NUMBER} to ${MAX_NUMBER}.`, "error");
    input.focus();
    return;
  }

  if (previousGuesses.has(guess)) {
    setFeedback("You’ve already tried that number. Pick a different one!", "error");
    input.select();
    return;
  }

  previousGuesses.add(guess);
  attemptsUsed += 1;
  const isCorrect = guess === secretNumber;
  addGuessToHistory(guess, isCorrect);

  const remaining = MAX_ATTEMPTS - attemptsUsed;
  triesLeft.textContent = String(remaining);
  attemptFill.style.width = `${(remaining / MAX_ATTEMPTS) * 100}%`;
  attemptProgress.setAttribute("aria-valuenow", String(remaining));
  if (remaining <= 2) {
    attemptFill.style.background = "linear-gradient(90deg, #ee7676, #ffaaaa)";
  }

  if (isCorrect) {
    isGameOver = true;
    setFeedback(`You got it! ${secretNumber} was the number — lovely guessing!`, "win");
  } else if (remaining === 0) {
    isGameOver = true;
    setFeedback(`That was your last try. The number was ${secretNumber}.`, "loss");
  } else {
    const direction = guess < secretNumber ? "higher" : "lower";
    const closeness = Math.abs(guess - secretNumber) <= 10 ? "So close! " : "";
    setFeedback(`${closeness}Go ${direction}. You’ve got ${remaining} ${remaining === 1 ? "try" : "tries"} left.`, "hint");
  }

  if (isGameOver) {
    input.disabled = true;
    form.querySelector("button[type='submit']").disabled = true;
    newGameButton.focus();
  } else {
    input.value = "";
    input.focus();
  }
}

form.addEventListener("submit", submitGuess);
newGameButton.addEventListener("click", startNewGame);

startNewGame();
