Basic usage of camera permissions to record and preview a recorded and stored file. 
const startRecording = async () => {
    setRecording(true);
    const targetFile = await camera.current.recordAsync();
    setVideoPreviewUrl(targetFile);
  };
