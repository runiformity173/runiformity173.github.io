let correctAnswer = 0;
function range(min, max) {
    return Math.floor(Math.random()*(max-min+1))+min;
}
function generateQuestion() {
    let question = "";
    let r = Math.random();
    const chance = 1/6;
    if (r < chance) { // mult
        const a = range(10,99);
        const b = range(10,99);
        question = `${a} × ${b}`;
        correctAnswer = a*b;
    } else if (r < 2*chance) { //squaring
        const a = range(13,99);
        question = `${a} × ${a}`;
        correctAnswer = a*a;
    } else if (r < 3*chance) { //squaring ending in 5. Supposed to multiply first digit by next number, add digits 25 to the end.
        const a = range(3,11);
        question = `${a}5 × ${a}5`;
        correctAnswer = (a*10+5)*(a*10+5);
    } else if (r < 4*chance) { // multiply by 9 (*10, - original)
        const a = range(13,99);
        question = `${a} × 9`;
        correctAnswer = a*9;
    } else if (r < 5*chance) { // multiply by 11 (middle is digits added, carrying if needed)
        const a = range(12,99);
        question = `${a} × 11`;
        correctAnswer = a*11;
    } else if (r < 6*chance) { // close to 100. (differences from 100 are a and b. first 2 digits is first number - a, second 2 are a*b)
        const a = range(90,99);
        const b = range(90,99);
        question = `${a} × ${b}`;
        correctAnswer = a*b;
    } // add difference of squares
    document.getElementById("question").innerHTML = question;
}
function submit() {
    const answer = Number(document.getElementById("answerBox").value);
    if (answer == correctAnswer) {
        alert("yippee!");
    } else {
        alert("Nope. The correct answer is "+String(correctAnswer));
    }
    document.getElementById("answerBox").value = "";
    generateQuestion();
}
document.getElementById("answerBox").addEventListener("keyup",function (e) {
    if (e.key === 'Enter') submit();
});
generateQuestion();