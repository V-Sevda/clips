import { Injectable } from '@angular/core';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

@Injectable({
  providedIn: 'root'
})
export class FfmpegService {
  isRunning = false
  isReady = false
  private ffmpeg

  constructor() {
    this.ffmpeg = createFFmpeg({ log:true })
   }

   async init() {
    if(this.isReady){
      return
    }

    await this.ffmpeg.load() //start loading FFmpeg, we can call the load function to start downloading FFmpeg

    this.isReady = true //prevent the ffmpeg to reload
   }

   async getScreenshots(file: File){
    this.isRunning = true
    //we need to convert a file from an onbject to a binary file to that we import the "fetchFile"
    const data = await fetchFile(file)
    //the FS function gives us access to the packages independent memory system, we can read and write files to this system.
    this.ffmpeg.FS('writeFile', file.name, data) //FS('action on file', 'fileName', 'data for the file')

    const seconds = [1,2,3]
    const commands: string[] = []

    seconds.forEach(second => {
      commands.push(
        //Input
        '-i', file.name,  //we're telling FFmpeg to process the file stored in the file system.
        //Output Options
        '-ss', `00:00:${second}`,  //we're changing the current timestamp.
        '-frames:v', '1',  //we're telling FFmpeg to focus on a single frame
        '-filter:v', 'scale=510:-1',
        //Output
        `output_0${second}.png`  //we're saving the frame to a file called output zero one dot PNG.
      )
    })

    await this.ffmpeg.run(
      ...commands
    )

    const screenshots: string[] = []

    seconds.forEach(second => {
      const screeshotFile = this.ffmpeg.FS(
        'readFile', `output_0${second}.png` //If we look at the first loop, the name of the file is the word output.
      )
      const screenshotBlob = new Blob(
        [screeshotFile.buffer], {
          type: 'image/png'
        }
      )

      const screenshotURL = URL.createObjectURL(screenshotBlob)

      screenshots.push(screenshotURL)
    })
    this.isRunning = false

    return screenshots
   }

   async blobFromURL(url: string){
    const response = await fetch(url)  //fetch a file from a blob
    const blob = await response.blob() //grab the file

    return blob
   }
}
