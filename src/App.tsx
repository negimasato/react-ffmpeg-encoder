import React, { useState } from 'react';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import './App.css';

const App: React.VFC = () => {
  const [video , setVideo] = useState<File>();
  const [videoSrc, setVideoSrc ] = useState('');
  const [message, setMessage ] = useState('Click');
  const [progress, setProgress] = useState(0);
  const ffmpeg = createFFmpeg({
    log: true,
  });
  const openFile = async () => {
    let handle;
    // @ts-ignore
    [ handle ] = await window.showOpenFilePicker({multiple: false});
    const file:File = await handle.getFile();
    setVideo(file);
  }
  const doTranscode = async () => {
    if(!video) {
      alert('OpenFile');
      return;
    }
    setMessage('Loading ffmpeg-core.js');
    await ffmpeg.load();
    setMessage('Start transcoding');
    ffmpeg.FS('writeFile', 'test.avi', await fetchFile(video));
    ffmpeg.setProgress(({ ratio }) => {
      setProgress(ratio);
    });
    await ffmpeg.run('-i', 'test.avi', 'test.mp4');
    setMessage('Complete transcoding');
    const data = ffmpeg.FS('readFile', 'test.mp4');
    setVideoSrc(URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' })));
  };
  return (
    <div className="App">
      <video src={videoSrc} controls></video><br/>
      <button onClick={openFile}>OpenFile</button>
      <button onClick={doTranscode}>Start</button>
      <p>{message}</p>
      <p>{progress}%</p>
    </div>
  );
}
export default App;
