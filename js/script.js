// Функция настройки сортировки методом Drag-n-Drop
function enableDragSort(photoClassName) {
    const photos = document.getElementsByClassName(photoClassName);
    DragPhotos = function () {
        this.dragPhotos = [];
        this.clear = () => { this.dragPhotos = []; };
        this.photos = () => { return this.dragPhotos; };
        this.push = (item) => { this.dragPhotos.push(item); };
        this.first = () => { return this.dragPhotos[0]; };
        this.get = (index) => { return this.dragPhotos[index]; };
        this.length = () => { return this.dragPhotos.length; };
        this.remove = (item) => {
            var index = this.dragPhotos.indexOf(item);
            if (index > -1) {
                this.dragPhotos.splice(index, 1);
            }
        };
    };
    var dragPhotos = new DragPhotos();
    Array.prototype.map.call(photos, function (photo) { enableDragItem(photo, dragPhotos) });
}
// Функция Добавления событий Drag-n-Drop а контейнер с фотографией
function enableDragItem(photo, dragPhotos) {
    photo.counter = 0;
    photo.setAttribute('draggable', true);
    photo.ondragstart = function (event) {
        dragPhotos.push(photo);
    };
    photo.ondragover = function (event) {
        event.preventDefault();
    };
    photo.ondragenter = function (event) {
        if (dragPhotos.length() == 1 && photo !== dragPhotos.first()) {
            photo.counter++;
            photo.classList.add('drag-active');
        }
    };
    photo.ondragleave = function (event) {
        photo.counter--;
        if (photo.counter === 0) {
            photo.classList.remove('drag-active');
        }
    };
    photo.onclick = function (event) {
        if (event.ctrlKey) {
            if (photo.classList.contains('drag-active')) {
                photo.classList.remove('drag-active');
                dragPhotos.remove(photo);
            } else {
                dragPhotos.push(photo);
                photo.classList.add('drag-active');
            }
        }
    }
    photo.ondrop = function (event) {
        if (dragPhotos.length() == 1 && photo !== dragPhotos.first()) {
            let photos = photo.parentNode;
            photo.classList.remove('drag-active');
            photo.counter = 0;
            for (var i = 0; i < dragPhotos.length(); i++) {
                photos.insertBefore(dragPhotos.get(i), photo);
            }
            dragPhotos.clear();
        }
    };
    photo.ontouchstart = function (event) {
        event.preventDefault();
        dragPhotos.push(photo);
    };
    photo.ontouchmove = function (event) {
        event.preventDefault();
        let coords = event.targetTouches[0];
        let x = coords.pageX;
        let y = coords.pageY;
        let el = document.elementFromPoint(x, y);


    };
    photo.ontouchend = function (event) {
        if (dragPhotos.length() == 1 && photo !== dragPhotos.first()) {
            let photos = photo.parentNode;
            photo.classList.remove('drag-active');
            photo.counter = 0;
            for (var i = 0; i < dragPhotos.length(); i++) {
                photos.insertBefore(dragPhotos.get(i), photo);
            }
            dragPhotos.clear();
        }
    };
};
// Функция подстройки изображений под контейнер
function adjustPhotos(photoClassName) {
    const photos = document.getElementsByClassName(photoClassName);
    Array.prototype.map.call(photos, function (photo) {
        let image = photo.getElementsByTagName('img')[0];
        if (image.complete) {
            adjustImages(image, photo);
        } else {
            image.onload = adjustImages(image, photo);
        }
    });
    // Функция подстройки изображения под контейнер
    function adjustImages(image, photo) {
        let imageRatio = image.width / image.height;
        let coeffX = photo.clientHeight * imageRatio;
        let coeffY = photo.clientWidth / imageRatio;
        if (imageRatio <= 1) {
            if (coeffY < photo.clientHeight) {
                image.height = photo.clientHeight;
                image.width = image.height * imageRatio;
            } else {
                image.width = photo.clientWidth;
                image.height = image.width / imageRatio;
            }
        } else {
            if (coeffX < photo.clientWidth) {
                image.width = photo.clientWidth;
                image.height = image.width / imageRatio;
            } else {
                image.height = photo.clientHeight;
                image.width = image.height * imageRatio;
            }
        }
        image.style.left = "calc(50% - " + image.width / 2 + "px)";
        image.style.top = "calc(50% - " + image.height / 2 + "px)";
    }
}
// Инициализация работы с фотографиями
(() => { adjustPhotos('photo'); enableDragSort('photo'); })();