import React from 'react';
import Dropzone from 'react-dropzone';
import request from 'superagent';


const CLOUDINARY_UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_URL = process.env.REACT_APP_CLOUDINARY_URL;

export default class ContactForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      uploadedFileCloudinaryUrl: '',
      uploadedFile: null
    }

    this.onImageDrop = this.onImageDrop.bind(this);
    this.handleImageUpload = this.handleImageUpload.bind(this);
  }

  onImageDrop(files) {
    this.setState({
      uploadedFile: files[0]
    });

    this.handleImageUpload(files[0]);
  }

  handleImageUpload(file) {
    const upload = request
      .post(CLOUDINARY_URL)
      .field('upload_preset', CLOUDINARY_UPLOAD_PRESET)
      .field('file', file);

    upload.end((err, res) => {
      if (err) {
        console.error(err);
      }
      if(res.body.secure_url) {
        this.setState({
          uploadedFileCloudinaryUrl: res.body.secure_url
        });
      }
    });

  }
  render() {
    return (
      <div className='file-upload'>
        <Dropzone
          onDrop={this.onImageDrop}
          accept='image/*'
        >
        <p>Drop an image or click to select a file to upload.</p>
        </Dropzone>
        <div>
          {this.state.uploadedFileCloudinaryUrl
            ? (
              <div>
              <p>{this.state.uploadedFile.name}</p>
              <img
                alt={this.state.uploadedFile.name}
                src={this.state.uploadedFileCloudinaryUrl}
              />
              </div>
            )
            : null
          }
        </div>
      </div>
    );
  }
}
