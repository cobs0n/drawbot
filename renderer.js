let lastImagePosition = { left: 1000, top: 500 };
let lastImageSize = { width: 0, height: 0 };

document.getElementById('toggleButton').addEventListener('click', () => {
    const formContainer = document.getElementById('formContainer');
    const overlay = document.getElementById('overlay');
    const fileInput = document.getElementById('file-input');
    const file = fileInput.files[0];

    if (file) {
        const validImageTypes = ['image/jpeg', 'image/png', 'image/bmp', 'image/webp'];
        if (validImageTypes.includes(file.type)) {
            const msgElement = document.getElementById('msg');
            msgElement.innerText = '';
            const image = document.getElementById('image');
            const reader = new FileReader();
            reader.onload = (e) => {
                image.src = e.target.result;
                window.api.sendImg( image.src );

                image.onload = () => {
                    const resizable = document.getElementById('resizable');
                    resizable.style.width = image.width + 'px';
                    resizable.style.height = image.height + 'px';
                    resizable.style.left = lastImagePosition.left + 'px';
                    resizable.style.top = lastImagePosition.top + 'px';
                    if (lastImageSize.width === 0 && lastImageSize.heigh === 0) {
                        lastImageSize = { width: parseInt(image.width), height: parseInt(image.height) };
                    } 
                    window.api.sendInfo({ lastImageSize: lastImageSize, lastImagePosition: lastImagePosition });

                };
            };
            reader.readAsDataURL(file);


            if (formContainer.style.display === 'none') {
                formContainer.style.display = 'block';
                overlay.style.display = 'none';
                document.body.style.overflow = 'visible';
                // Exit full screen
                if (document.fullscreenElement) {
                    document.exitFullscreen().then(() => {
                        // Restore window size after exiting full screen
                        window.resizeTo(initialWindowSize.width, initialWindowSize.height);
                        window.setSize(800, 600, false)
                        window.center()
                    });
                }
            } else {
                formContainer.style.display = 'none';
                overlay.style.display = 'block';
                document.body.style.overflow = 'hidden';
                // Enter full screen
                document.documentElement.requestFullscreen().then(() => {
                });
            }
        } else {
            const msgElement = document.getElementById('msg');
            msgElement.innerText = 'Wrong file format';
        }
    } else {
        const msgElement = document.getElementById('msg');
        msgElement.innerText = 'No file has been selected';
    }
});

document.getElementById('file-input').addEventListener('change', function (event) {
    const files = event.target.files;

    if (files.length > 0) {
        const file = files[0]; 
        const validImageTypes = ['image/jpeg', 'image/png', 'image/bmp', 'image/webp'];
        if (validImageTypes.includes(file.type)) {

            image.onload = () => {
                const resizable = document.getElementById('resizable');
                lastImagePosition = { left: parseInt(resizable.style.left), top: parseInt(resizable.style.top) };

                lastImageSize = { width: parseInt(image.width), height: parseInt(image.height) };
                window.api.sendInfo({ lastImageSize: lastImageSize, lastImagePosition: lastImagePosition });

            };
            const reader = new FileReader();
            reader.onload = function (e) {
                const contents = e.target.result;
                window.api.sendImg(contents);
            };
            updateImageInfo()

        }
    }
});


const resizable = document.getElementById('resizable');

resizable.addEventListener('mousedown', mouseDown);
resizable.addEventListener('wheel', resizeOnScroll);

function mouseDown(e) {
    e.preventDefault();
    document.addEventListener('mousemove', mouseMove);
    document.addEventListener('mouseup', mouseUp);

    let prevX = e.clientX;
    let prevY = e.clientY;

    function mouseMove(e) {
        const rect = resizable.getBoundingClientRect();

        let newLeft = rect.left - (prevX - e.clientX);
        let newTop = rect.top - (prevY - e.clientY);

        if (newLeft < 0) newLeft = 0;
        if (newTop < 0) newTop = 0;
        if (newLeft + rect.width > window.innerWidth) newLeft = window.innerWidth - rect.width;
        if (newTop + rect.height > window.innerHeight) newTop = window.innerHeight - rect.height;

        resizable.style.left = newLeft + 'px';
        resizable.style.top = newTop + 'px';
        resizable.style.transform = 'none';

        prevX = e.clientX;
        prevY = e.clientY;
    }

    function mouseUp() {
        document.removeEventListener('mousemove', mouseMove);
        document.removeEventListener('mouseup', mouseUp);
        lastImagePosition = { left: resizable.style.left, top: resizable.style.top };
        updateImageInfo();
    }
}



function resizeOnScroll(e) {
    e.preventDefault();

    const scaleAmount = 0.1;
    let width = resizable.clientWidth;
    let height = resizable.clientHeight;

    if (e.deltaY < 0) {
        width += width * scaleAmount;
        height += height * scaleAmount;
    } else {
        width -= width * scaleAmount;
        height -= height * scaleAmount;
    }

    resizable.style.width = width + 'px';
    resizable.style.height = height + 'px';
    lastImageSize = { width: parseInt(width), height: parseInt(height) };
    updateImageInfo();
}

function updateImageInfo() {
    window.api.sendInfo({ lastImageSize: lastImageSize, lastImagePosition: lastImagePosition });

    document.getElementById('lastPosition').textContent = `(${lastImagePosition.left}, ${lastImagePosition.top})`;
    document.getElementById('lastWidth').textContent = lastImageSize.width + 'px';
    document.getElementById('lastHeight').textContent = lastImageSize.height + 'px';
}

let closebtn = document.getElementById('closeButton');

closebtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.api.closeCurrentWindow();
});

document.getElementById('minimizeButton').addEventListener('click', (e) => {
    e.preventDefault();
    window.api.minimizeCurrentWindow();
});
