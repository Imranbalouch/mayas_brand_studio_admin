// Cropper Variables
var imageMulti = document.getElementById('uploadedAvatarMulti');
var cropBtnMulti = document.getElementById('cropMulti');
var cropperMulti;
let CropBoxWidthMulti = 100;
let CropBoxHeightMulti = 100;
let fileNameCropMulti = "";
let inputCropMulti = "";
let fileSizeCropMulti;
let editRemoveIndex;

let filesArr0 = [];

$("#MultiFileUpload").on("change", function (e) {
  e.preventDefault();
  let files = e.target.files;
  let filesArr = new DataTransfer();
  if (!files) {
    return;
  }
  
  CropBoxWidthMulti = e.target.getAttribute("w");
  CropBoxHeightMulti = e.target.getAttribute("h");
  inputCropMulti = e.target;

  $(this).parents(".form-group").removeClass("error");
  $(this).parents(".form-group").find(".showUnSelectedImages").html("");

  const ExtArr = ["png", "jpg", "jpeg", "webp"];

  let FileNamesArr = [];

  $(inputCropMulti).parents(".form-group").find(".preview-card").each((i1, item1) => {
    FileNamesArr.push(item1.getAttribute("FileName"));
  });

  $(inputCropMulti.files).each((i, file) => {
    if (!FileNamesArr.includes(file.name)) {
      filesArr0.push(file);
    }
  });

  // Size
  // $(filesArr0).each((i, file) => {
  //   if (file.size > 5000000) {
  //     filesArr0.splice(i, 1);
  //     $(this).parents(".form-group").addClass("error");
  //     $(this).parents(".form-group").find(".showUnSelectedImages").html(`
  //       <span class="error-txt">${'File size must be less then 5mb'}</span>  
  //     `);
  //   }
  // });

  // Extention
  $(filesArr0).each((i, file) => {
    if (!ExtArr.includes(file.name.substring(file.name.lastIndexOf(".") + 1))) {
      filesArr0.splice(i, 1);
      $(this).parents(".form-group").addClass("error");
      $(this).parents(".form-group").find(".showUnSelectedImages").html(`
        <span class="error-txt">${'Invalid file extention: ' + file.name}</span>  
      `);
    }
  });

  $(filesArr0).each((i, file) => {
    filesArr.items.add(file);
  });

  files = filesArr.files;
  inputCropMulti.files = filesArr.files
 
  $(inputCropMulti.files).each((i, file) => {
    let FileNames = [];

    $(inputCropMulti).parents(".form-group").find(".file-preview-imgs .preview-card").each((i1, item1) => {
      FileNames.push(item1.getAttribute("FileName"));
    });

    if (!FileNames.includes(file.name)) {
      $(inputCropMulti).parents(".form-group").find(".file-preview-imgs").append(`
        <div class="preview-card" FileName="${file.name}">
          <div class="img">
            <img src="${URL.createObjectURL(file)}" alt="">
            <span class="edit"><i class="fa-solid fa-pen-to-square"></i></span>
            <span class="remove"><i class="fa-solid fa-x"></i></span>
          </div>
          <div class="card-info">
            <div class="card-name">${file.name.length >= 7 ? file.name.slice(0, 7).replace(/\.[^/.]+$/, "") + "... " : file.name.replace(/\.[^/.]+$/, "")}.${file.name.substring(file.name.lastIndexOf(".") + 1)}</div>
            <div class="card-size">${calc_file_size(file.size)}</div>
          </div>
        </div>
      `);
    }

    $(inputCropMulti).parents(".form-group").find(".file-preview-imgs .preview-card").each((i, item) => {
      $(item).attr("index", i);
      imageUrlToBase64($(item).find(".img img").attr("src"), function (base64String) {
        $(item).find(".img img").attr("src", base64String);
      });
    });

  });

  setTimeout(() => {
    $(this).parents(".form-group").find(".file-preview-imgs .preview-card .remove").on("click", function (e1) {
      e1.preventDefault();
      $(this).parents(".form-group").removeClass("error");
      $(this).parents(".form-group").find(".showUnSelectedImages").html("")
      let newfilesArr = new DataTransfer();
      $(this).parents(".form-group").find(".file-preview-imgs .preview-card").each((i, item) => {
        if (parseInt($(item).attr("index")) === parseInt($(this).parent().parent().attr("index"))) {
          editRemoveIndex = i;
          filesArr0.splice(i, 1);
        }
      });
      $(filesArr0).each((i, file) => {
        newfilesArr.items.add(file);
      });
      files = newfilesArr.files;
      inputCropMulti.files = newfilesArr.files;
      $(this).parent().parent().remove();

      $(inputCropMulti).parents(".form-group").find(".file-preview-imgs .preview-card").each((i, item) => {
        $(item).attr("index", i)
      });
    });

    $(this).parents(".form-group").find(".file-preview-imgs .preview-card .edit").on("click", function (e1) {
      e1.preventDefault();

      $(this).parents(".form-group").find(".file-preview-imgs .preview-card").each((i, item) => {
        if (parseInt($(item).attr("index")) === parseInt($(this).parent().parent().attr("index"))) {
          editRemoveIndex = i;
          fileNameCropMulti = inputCropMulti.files[i].name;
          fileSizeCropMulti = inputCropMulti.files[i].size;
          var fileReader = new FileReader();
          fileReader.onload = function () {
            var img = new Image();
            img.src = fileReader.result;
            img.onload = function () {
              var done = function (url) {
                imageMulti.src = url;
                $("#cropAvatarmodalMulti").modal('show');
              };
              var reader = new FileReader();
              reader.onload = function (e) {
                done(reader.result);
              };
              reader.readAsDataURL(inputCropMulti.files[i]);
              return
            };
          };
          fileReader.readAsDataURL(inputCropMulti.files[i]);
        }
      });

      $(inputCropMulti).parents(".form-group").find(".file-preview-imgs .preview-card").each((i, item) => {
        $(item).attr("index", i)
      });

    });
  }, 1000);

  $(inputCropMulti.files).each(async (i, file) => {
    await removeEdit(i, file);
  });

  for (let i = inputCropMulti.files.length - 1; i >= 0; i--) {
    removeCard(i, files[i]);
  }

});

function getCroppedCanvasFunctionMulti() {
  var canvas;

  $("#cropAvatarmodalMulti").modal('hide');
  $(inputCropMulti).parents(".form-group").removeClass("error")
  $(inputCropMulti).parents(".form-group").find(".file-preview-imgs .preview-card[index=" + editRemoveIndex + "]").remove();
  filesArr0.splice(editRemoveIndex, 1);

  if (cropperMulti) {
    canvas = cropperMulti.getCroppedCanvas({
      width: CropBoxWidthMulti,
      height: CropBoxHeightMulti,
    });
    canvas.toBlob(function (blob) {
      var file = new File([blob], fileNameCropMulti, { type: 'image/png' });
      let container = new DataTransfer();
      let containerNew = new DataTransfer();
      container.items.add(file);

      filesArr0.push(file);

      $(filesArr0).each((i, file) => {
        containerNew.items.add(file);
      });

      var reader = new FileReader();
      reader.onload = function (event) {
        var imageData = event.target.result;
        let fileExt = fileNameCropMulti.substring(fileNameCropMulti.lastIndexOf(".") + 1);

        $(inputCropMulti).parents(".form-group").find(".file-preview-imgs").append(`
          <div class="preview-card" FileName="${file.name}">
            <div class="img">
              <img src="${imageData}" alt="">
              <span class="remove"><i class="fa-solid fa-x"></i></span>
            </div>
            <div class="card-info">
              <div class="card-name">${fileNameCropMulti.length >= 7 ? fileNameCropMulti.slice(0, 7).replace(/\.[^/.]+$/, "") + "... " : fileNameCropMulti.replace(/\.[^/.]+$/, "")}.${fileExt}</div>
              <div class="card-size">${calc_file_size(fileSizeCropMulti)}</div>
            </div>
          </div>
        `);

        $(inputCropMulti).parents(".form-group").find(".file-preview-imgs .preview-card").each((i, item) => {
          $(item).attr("index", i)
        });

        $(inputCropMulti).parents(".form-group").find(".file-preview-imgs .preview-card .remove").on("click", function (e1) {
          e1.preventDefault();
          $(this).parents(".form-group").removeClass("error");
          $(this).parents(".form-group").find(".showUnSelectedImages").html("")
          let newfilesArr = new DataTransfer();
          $(this).parents(".form-group").find(".file-preview-imgs .preview-card").each((i, item) => {
            if (parseInt($(item).attr("index")) === parseInt($(this).parent().parent().attr("index"))) {
              editRemoveIndex = i;
              filesArr0.splice(i, 1);
            }
          });
          $(filesArr0).each((i, file) => {
            newfilesArr.items.add(file);
          });
          inputCropMulti.files = newfilesArr.files;
          $(this).parent().parent().remove();

          $(inputCropMulti).parents(".form-group").find(".file-preview-imgs .preview-card").each((i, item) => {
            $(item).attr("index", i)
          });
        });

      };
      reader.readAsDataURL(blob);

      inputCropMulti.files = containerNew.files;
    }, 'image/png');
  }
}

$("#cropAvatarmodalMulti").on('shown.bs.modal', function () {
  let minCropBoxWidth = CropBoxWidthMulti;
  let minCropBoxHeight = CropBoxHeightMulti;

  cropperMulti = new Cropper(imageMulti, {
    viewMode: 2,
    autoCropArea: 0.1,
    aspectRatio: minCropBoxWidth / minCropBoxHeight,
    zoomable: false,
    minCropBoxWidth: minCropBoxWidth,
    minCropBoxHeight: minCropBoxHeight,
    cropBoxResizable: false,
    dragMode: "move",
    movable: false
  });
}).on('hidden.bs.modal', function () {
  cropperMulti.destroy();
  cropperMulti.clear();
  cropperMulti.reset();
  cropperMulti = null;
});

cropBtnMulti.addEventListener('click', function () {
  getCroppedCanvasFunctionMulti();
});

function calc_file_size(bytes) {
  if (bytes >= 1073741824) {
    bytes = Math.floor(bytes / 1073741824) + " GB";
  } else if (bytes >= 1048576) {
    bytes = Math.floor(bytes / 1048576) + " MB";
  } else if (bytes >= 1024) {
    bytes = Math.floor(bytes / 1024) + " KB";
  } else if (bytes > 1) {
    bytes = Math.floor(bytes) + " Bytes";
  } else if (bytes == 1) {
    bytes = Math.floor(bytes) + " Byte";
  } else {
    bytes = "0 bytes";
  }
  return bytes;
}

async function getImageDimensions(file) {
  const imageUrl = URL.createObjectURL(file);
  const img = new Image();

  return new Promise((resolve, reject) => {
    img.onload = function () {
      URL.revokeObjectURL(imageUrl);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };

    img.onerror = function (err) {
      URL.revokeObjectURL(imageUrl);
      reject(err);
    };

    img.src = imageUrl;
  });
}

async function removeEdit(i, file) {
  try {
    const dimensions = await getImageDimensions(file);
    const $previewCards = $(inputCropMulti).parents(".form-group").find(".preview-card");
    if (dimensions.width == parseInt(CropBoxWidthMulti) && dimensions.height == parseInt(CropBoxHeightMulti)) {
      if ($previewCards?.eq(i).find(".edit")) {
        $previewCards?.eq(i).find(".edit").remove();
      }
    }
  } catch (error) {
    console.error('Error loading image:', error);
  }
}

async function removeCard(i, file) {
  try {
    const dimensions = await getImageDimensions(file);
    const $previewCards = $(inputCropMulti).parents(".form-group").find(".file-preview-imgs .preview-card");
    if (dimensions.width < parseInt(CropBoxWidthMulti) || dimensions.height < parseInt(CropBoxHeightMulti)) {
      $previewCards.eq(i)?.remove();
      $(inputCropMulti).parents(".form-group").addClass("error");
      $(inputCropMulti).parents(".form-group").find(".showUnSelectedImages").html(`
        <span class="error-txt">File width and height must be (${CropBoxWidthMulti}x${CropBoxHeightMulti})</span>  
      `);

      let newFilesArr = new DataTransfer();
      filesArr0.splice(i, 1);
      $(filesArr0).each((j, file) => {
        newFilesArr.items.add(file);
      });
      inputCropMulti.files = newFilesArr.files;

      $(inputCropMulti).parents(".form-group").find(".preview-card").each((index, item) => {
        $(item).attr("index", index);
      });
    }
  } catch (error) {
    console.error('Error loading image:', error);
  }
}

function imageUrlToBase64(url, callback) {
  fetch(url)
    .then(response => response.blob())
    .then(blob => {
      let reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = function () {
        callback(reader.result);
      }
    })
    .catch(error => console.error('Error converting image to base64:', error));
}