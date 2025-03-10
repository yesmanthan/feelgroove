
// Simple script to check if model files are present
(function() {
  const requiredFiles = [
    'tiny_face_detector_model-shard1',
    'tiny_face_detector_model-weights_manifest.json',
    'face_expression_model-shard1',
    'face_expression_model-weights_manifest.json',
    'face_landmark_68_model-shard1',
    'face_landmark_68_model-weights_manifest.json',
    'face_recognition_model-shard1',
    'face_recognition_model-shard2',
    'face_recognition_model-weights_manifest.json'
  ];
  
  const missingFiles = [];
  
  // Check which files are missing
  for (const file of requiredFiles) {
    fetch(`/models/${file}`)
      .then(response => {
        if (!response.ok) {
          missingFiles.push(file);
          console.error(`Missing model file: ${file}`);
        }
      })
      .catch(err => {
        missingFiles.push(file);
        console.error(`Error fetching ${file}:`, err);
      });
  }
  
  // Display message after checks
  setTimeout(() => {
    if (missingFiles.length > 0) {
      console.warn('Missing face detection model files:', missingFiles);
      console.info('Please download the model files from: https://github.com/vladmandic/face-api/tree/master/model');
    } else {
      console.info('All face detection model files are present!');
    }
  }, 2000);
})();
