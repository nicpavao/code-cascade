let score = 0;
let puzzle = "Solve this code...";

function solvePuzzle() {
    let solution = document.getElementById("solution").value;
    if (solution.trim() !== "") {
        document.getElementById("history").innerHTML += `<p><b>Q:</b> ${puzzle} <br> <b>A:</b> ${solution}</p>`;
        score += 10;
        document.getElementById("score").innerText = `Score: ${score}`;
        document.getElementById("solution").value = "";
        puzzle = "Next puzzle loading...";
        document.getElementById("puzzle").innerText = puzzle;
    }
}
