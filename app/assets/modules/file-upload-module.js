
var app=angular.module('able-file-upload', ['angularRipple','thatisuday.dropzone']);

app.config(function(dropzoneOpsProvider){
			dropzoneOpsProvider.setOptions({
				url : 'upload.php',
				acceptedFiles : 'image/jpeg, images/jpg, image/png',
				addRemoveLinks : true,
				dictDefaultMessage : 'Click to add or drop photos',
				dictRemoveFile : 'Remove photo',
				dictResponseError : 'Could not upload this photo'
			});
		});