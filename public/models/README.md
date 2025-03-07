
# Face-API.js Models

This directory contains the models used by face-api.js for facial recognition and expression detection.

## Model Files

The following model files should be downloaded and placed in this directory:

- tiny_face_detector_model-shard1
- tiny_face_detector_model-weights_manifest.json
- face_expression_model-shard1
- face_expression_model-weights_manifest.json
- face_landmark_68_model-shard1
- face_landmark_68_model-weights_manifest.json
- face_recognition_model-shard1
- face_recognition_model-shard2
- face_recognition_model-weights_manifest.json

## Automatic Download

You can download these models automatically by visiting this URL in your browser:
https://github.com/vladmandic/face-api/tree/master/model

Or clone the repository and copy the models folder:
```
git clone https://github.com/vladmandic/face-api.git
cp -r face-api/model/* /path/to/your/project/public/models/
```

The models will be accessed by the application from the /models path.
