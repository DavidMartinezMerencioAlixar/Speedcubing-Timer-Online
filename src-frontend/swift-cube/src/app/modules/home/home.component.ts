import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit {
  private intervalId!: any;
  private startTime!: number;
  private elapsedTime!: number;
  private timerInterval!: any;
  private keyPressed: boolean = false;
  private readyToStart: boolean = false;
  private runningTimer: boolean = false;

  ngAfterViewInit(): void {
    const formContainer = document.getElementById("scrambleDiv");
    formContainer?.scrollIntoView();

    const cubeNames = <HTMLSelectElement>document.getElementById("cubeNames");
    cubeNames?.addEventListener("change", () => {
      this.getCubeData(cubeNames.options[cubeNames.selectedIndex].value);
      setTimeout(this.generateScramble, 100);
    });

    this.getAllCubes();
    setTimeout(() => { this.getCubeData(cubeNames.options[cubeNames.selectedIndex].value); }, 100);
    setTimeout(this.generateScramble, 100);
    
  }

  constructor() {
    window.addEventListener('keydown', (event: KeyboardEvent) => {
      event.preventDefault();
      const time = document.getElementById("time");
      if (this.runningTimer) {
        this.stopTimer();
      } else if (!this.keyPressed && event.key === ' ') {
        if (time != null) time.style.color = 'red';
        this.keyPressed = true;
        this.startTime = Date.now();
        this.intervalId = setInterval(() => {
          this.elapsedTime = Date.now() - this.startTime;
          this.readyToStart = this.elapsedTime >= 500;
          if (this.readyToStart) {
            if (time != null) {
              time.style.color = 'green';
              time.textContent = '0.00';
            }
          }
        }, 10);
      }
    });

    window.addEventListener('keyup', (event: KeyboardEvent) => {
      const time = document.getElementById("time");
      if (event.key === ' ') {
        this.keyPressed = false;
        clearInterval(this.intervalId);
        this.elapsedTime = Date.now() - this.startTime;
        if (time != null) time.style.color = '';
        if (this.readyToStart) {
          this.readyToStart = false;
          this.startTimer();
        }
      }
    });
  }

  startTimer() {
    const startTime: number = Date.now();
    this.runningTimer = true;
    this.timerInterval = setInterval(() => { this.updateTimer(startTime) }, 10);
  }

  updateTimer(startTime: number) {
    const elapsedTime = Date.now() - startTime;
    let minutes = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60));
    let seconds: any = Math.floor((elapsedTime % (1000 * 60)) / 1000);
    let milliseconds: any = (Math.floor((elapsedTime % 1000)) / 10).toFixed(0);
    milliseconds = milliseconds >= 100 ? 0 : milliseconds < 10 ? "0" + milliseconds : milliseconds;

    const time = document.getElementById("time");
    if (time != null) {

      if (minutes <= 0) {
        time.textContent = seconds + "." + milliseconds;

      } else {
        seconds = seconds < 10 ? "0" + seconds : seconds;
        time.textContent = minutes + ":" + seconds + "." + milliseconds;
      }
    }
  }

  stopTimer() {
    clearInterval(this.timerInterval);
    this.runningTimer = false;
    this.generateScramble();
  }

  generateScramble() {
    const movementTypes = localStorage.getItem("cube.movementTypes") || "";
    const totalMovs = Number.parseInt(localStorage.getItem("cube.movements_number") || "0");

    const possibleMovs = movementTypes.split(" ");
    const numPossibleMovs = possibleMovs.length;
    let scramble = "", actualMov, lastMov = "";

    for (let i = 0; i < totalMovs; i++) {
      /* Generates a new letter until it doesn't match the last one generated */
      do {
        actualMov = possibleMovs[Math.floor(Math.random() * (numPossibleMovs - 1))];
      } while (actualMov.charAt(0) === lastMov.charAt(0));
      lastMov = actualMov;

      /* Adds the movement to the final scramble */
      scramble += " " + actualMov;
    }

    /* Prints the new scramble in the web */
    const scrambleText = document.getElementById("scramble");
    if (scrambleText != null) scrambleText.textContent = scramble;
  }

  async getCubeData(cubeName: String) {
    const URL = `http://localhost:5000/cubes/${cubeName}`;
    
    const response = await fetch(URL
    ).then(response => {
      if (response.status === 200) {
        response.json().then(cube => {
          localStorage.setItem("cube.movementTypes", cube.movement_types);
          localStorage.setItem("cube.movements_number", cube.movements_number);
        });
      }
    }).catch(error => {
      console.error("Error getting cube data:", error);
    });
  }

  async getAllCubes() {
    const URL = "http://localhost:5000/cubes";
    
    const response = await fetch(URL
    ).then(response => {
      if (response.status === 200) {
        response.json().then(cubes => {
          const cubeNames = document.getElementById("cubeNames");
          if (cubeNames != null) {
            cubes.forEach((cube: any) => {
              const newOption = document.createElement("option");
              newOption.value = cube.name;
              newOption.textContent = cube.name;
              cubeNames.appendChild(newOption);
            });
          }
        });
      }
    }).catch(error => {
      console.error("Error getting cube data:", error);
    });
  }
}
