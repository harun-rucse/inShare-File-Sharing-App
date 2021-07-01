/*eslint-disable */
import axios from 'axios';

const dropZone = document.querySelector('.drop-zone');
const fileInput = document.querySelector('#fileInput');
const browseBtn = document.querySelector('.browseBtn');

const progressContainer = document.querySelector('.progress-container');
const sharingContainer = document.querySelector('.sharing-container');
const progressBg = document.querySelector('.progress-bg');
const percentDiv = document.querySelector('#percent');
const progressBar = document.querySelector('.progress-bar');
const fileUrlInput = document.querySelector('#fileUrl');
const copyBtn = document.querySelector('#copyBtn');
const form = document.querySelector('.form');
const toast = document.querySelector('.toast');

const maxAllowedSize = 100 * 1024 * 1024; // 100MB

dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  if (!dropZone.classList.contains('dragged')) {
    dropZone.classList.add('dragged');
  }
});

dropZone.addEventListener('dragleave', (e) => {
  dropZone.classList.remove('dragged');
});

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.classList.remove('dragged');
  const { files } = e.dataTransfer;

  if (files.length) {
    uploadFile(files);
  }
});

fileInput.addEventListener('change', (e) => {
  uploadFile(e.target.files);
});

browseBtn.addEventListener('click', (e) => {
  fileInput.click();
});

copyBtn.addEventListener('click', () => {
  fileUrlInput.select();
  document.execCommand('copy');
  showToast('Link Coppied!', 'success');
});

const uploadFile = (files) => {
  // Restrict more than one file
  if (files.length > 1) {
    showToast('Not allowed more than 1 file', 'error');
    return;
  }
  // Restrict not more than 100MB
  if (files[0].size > maxAllowedSize) {
    showToast("Can't upload more than 100MB", 'error');
    return;
  }
  progressContainer.style.display = 'block';
  const file = files[0];
  const formData = new FormData();
  formData.append('myfile', file);

  const config = {
    onUploadProgress: uploadProgress,
  };

  axios
    .post('/api/files', formData, config)
    .then((res) => {
      onUploadSuccess(res.data.file);
    })
    .catch((error) => {
      showToast('Something went wrong', 'error');
    });
};

const uploadProgress = (progress) => {
  const percent = Math.round((progress.loaded / progress.total) * 100);

  progressBg.style.width = `${percent}%`;
  percentDiv.innerText = percent;
  progressBar.style.width = `${percent}%`;
};

const onUploadSuccess = (link) => {
  form[2].removeAttribute('disabled');
  form[2].style.cursor = 'pointer';
  progressContainer.style.display = 'none';
  sharingContainer.style.display = 'flex';
  fileUrlInput.value = link;
};

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const link = fileUrlInput.value.split('/').splice(-1, 1)[0];
  const formData = {
    uuid: link,
    emailFrom: form.elements['email-from'].value,
    emailTo: form.elements['email-to'].value,
  };

  // Send POST request
  axios
    .post('/api/files/send', formData)
    .then((res) => {
      if (res.data.status === 'success') {
        showToast('Email send', 'success');

        // Disable Send button
        form[2].setAttribute('disabled', 'true');
        form[2].style.cursor = 'not-allowed';
      }
    })
    .catch((err) => {
      showToast('Email send faield', 'error');
    });
});

let toastTimer;
const showToast = (message, type) => {
  type === 'success'
    ? (toast.style.background = 'rgb(0, 158, 40)')
    : (toast.style.background = 'red');
  toast.innerText = message;
  toast.style.transform = 'translate(-50%, 0)';

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.style.transform = 'translate(-50%, 60px)';
  }, 2000);
};
