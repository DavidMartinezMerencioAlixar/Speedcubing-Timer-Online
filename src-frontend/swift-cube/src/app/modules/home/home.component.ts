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
    if (formContainer != null) formContainer.scrollIntoView();
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
  }
}



  // startTime: any, endTime: any, elapsedTime: any, timerInterval: any;

  // startTimer() {
  //   if (!timerInterval) {
  //     startTime = new Date().getTime();
  //     timerInterval = setInterval(updateTimer, 10);
  //   }
  // }

  // stopTimer() {
  //   if (timerInterval) {
  //     clearInterval(timerInterval);
  //     endTime = new Date().getTime();
  //     elapsedTime = endTime - startTime;
  //     timerInterval = null;
  //   }
  // }

  // resetTimer() {
  //   clearInterval(timerInterval);
  //   timerInterval = null;
  //   elapsedTime = null;
  //   document.getElementById("timer").innerHTML = "00:00:000";
  // }

  // updateTimer() {
  //   var now = new Date().getTime();
  //   elapsedTime = now - startTime;
  //   var minutes = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60));
  //   var seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);
  //   var milliseconds = Math.floor((elapsedTime % 1000));
  //   minutes = (minutes < 10) ? "0" + minutes : minutes;
  //   seconds = (seconds < 10) ? "0" + seconds : seconds;
  //   milliseconds = (milliseconds < 10) ? "00" + milliseconds : (milliseconds < 100) ? "0" + milliseconds : milliseconds;
  //   document.getElementById("timer").innerHTML = minutes + ":" + seconds + ":" + milliseconds;
