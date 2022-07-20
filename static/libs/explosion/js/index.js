const defaultOptions = {
    linkClass: '.card',
};

const explosionClassName = 'explosion';
const explosionOpenedClassName = 'explosion_Opened';
const explosionOpeningClassName = 'explosion_Opening';

const explosionSummaryClassName = 'explosionSummary';
const explosionControlsClassName = 'explosionControls';
const explosionImagesClassName = 'explosionImages';

const explosionSummaryContentClassName = 'explosionSummaryContent';
const explosionTitleClassName = 'explosionTitle';
const explosionDescriptionClassName = 'explosionDescription';
const explosionImageClassName = 'explosionImage';

const explosionCloseClassName = 'explosionClose';
const explosionNavsClassName = 'explosionNavs';

const explosionNavClassName = 'explosionNav'; 
const explosionNavPrevClassName = 'explosionNavPrev';
const explosionNavNextClassName = 'explosionNavNext';
const explosionCouterClassName = 'explosionCounter';
const explosionNavDisabledClassName = 'explosionNavDisabled';

const explosionPrevHiddenImageClassName = 'explosionImage_PrevHidden';
const explosionPrevShowingImageClassName = 'explosionImage_PrevShowing';
const explosionActiveImageClassName = 'explosionImage_Active';
const explosionNextShowingImageClassName = 'explosionImage_NextShowing';
const explosionNextHiddenImageClassName = 'explosionImage_NextHidden';

class ExplositionGallery {
    constructor(elementNode, options){
        this.options = {
            ...defaultOptions,
            ...options
        };
        this.containerNode = elementNode;
        this.linkNodes = elementNode.querySelectorAll(this.options.linkClass);

        this.minWidth = 1023;
        this.minHeight = 600;
        this.padding = 2 * 16;
        this.showingCount = 4;
        this.currentIndex = 0;

        this.size = this.linkNodes.lenght;//почему то не работает присвоение ниже в счетчике
        //Инициализация модального окна
        //делаем копию картинок и кладем вниз body
        this.initModal();
        this.events();
    }

    initModal() {
        this.modalContainerNode = document.createElement("div");
        this.modalContainerNode.className = explosionClassName;

        this.modalContainerNode.innerHTML = `
            <div class="${explosionSummaryClassName}">
                <div class="${explosionSummaryContentClassName}">
                    <h2 class="${explosionTitleClassName}"></h2>
                    <p class="${explosionDescriptionClassName}"></p>
                </div>
            </div>    
            <div class="${explosionControlsClassName}">
                <button class="${explosionCloseClassName}"></button>
                <div class="${explosionNavClassName}">
                    <button class="${explosionNavClassName} ${explosionNavPrevClassName}"></button>
                    <div class="${explosionCouterClassName}">
                        1/${this.linkNodes.length}
                    </div>
                    <button class="${explosionNavClassName} ${explosionNavNextClassName}"></button>
                </div>
            </div>
            <div class="${explosionImagesClassName}">
                ${Array.from(this.linkNodes).map((linkNode) => `
                    <img src="${linkNode.getAttribute('href')}" alt="${linkNode.dataset.title}" class="${explosionImageClassName}" data-title="${linkNode.dataset.title}" data-description="${linkNode.dataset.description}" />
                `).join('')}
            </div>
        `;

        document.body.appendChild(this.modalContainerNode);

        this.explosionImageNodes = this.modalContainerNode.querySelectorAll(`.${explosionImageClassName}`);

    }

    events() {
        this.containerNode.addEventListener('click', this.activateGallery);
    }

    activateGallery = (event) => {
        event.preventDefault();
        const linkNode = event.target.closest('a');

        if (
            !linkNode
            || this.modalContainerNode.classList.contains(explosionOpenedClassName)
            || this.modalContainerNode.classList.contains(explosionOpeningClassName)
        ){
            return;
        }

        this.currentIndex = Array.from(this.linkNodes).findIndex((itemNode) =>
            linkNode === itemNode);
        this.modalContainerNode.classList.add(explosionOpenedClassName);

        fadeIn(this.modalContainerNode, () => {
            this.modalContainerNode.classList.remove(explosionOpeningClassName);
            this.modalContainerNode.classList.add(explosionOpenedClassName);
            this.switchChanges();
        });

        this.setInitSizesToImages();
        this.setInitPositionsToImages();
    }

    setInitSizesToImages() {
        this.linkNodes.forEach ((linkNode, index) => {
            const data = linkNode.getBoundingClientRect();
            //console.log(data); // При помощи этого мы можем олучить много полезнай информации о изображениях
            this.explosionImageNodes[index].style.width = data.width + 'px'; 
            this.explosionImageNodes[index].style.height = data.height + 'px'; 
        });
    }

    setInitPositionsToImages() {
        this.linkNodes.forEach ((linkNode, index) => {
            const data = linkNode.getBoundingClientRect();
            //console.log(data); // При помощи этого мы можем олучить много полезнай информации о изображениях
            this.setPositionStyles(
                this.explosionImageNodes[index],
                data.left,
                data.top,
            );
        });
    }

    setPositionStyles(element, x, y){
        element.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
    }

    switchChanges(){
        //установить фотографии на нужные места
        //установить состояния контролов
        //изменить каунтер
        //установить изменить описание
        this.setCurrentState
    }

    setCurrentState() {
        this.explosionPrevHiddenImageNodes = [];
        this.explosionPrevShowingImageNodes = [];
        this.explosionActiveImageNodes = [];
        this.explosionNextShowingImageNodes = [];
        this.explosionNextHiddenImageNodes = [];

    }
}

/**
 * Helpers
 */
function fadeIn(element, callback) {
    animation();

    function animation() {
        let opacity = Number(element.style.opacity);
        if (opacity < 1) {
            opacity = opacity + 0.1
            element.style.opacity = opacity;
            window.requestAnimationFrame(animation);
            return;
        }

        if (callback) {
            callback();
        }
    }
}

function fadeOut(element, callback) {
    animation();

    function animation() {
        let opacity = Number(element.style.opacity);
    
        if (opacity > 0) {
            opacity = opacity - 0.04
            element.style.opacity = opacity;
            window.requestAnimationFrame(animation);
            return;
        }

        if (callback) {
            callback();
        }
    }
}

function throttle(callback, delay = 200) {
    let isWaiting = false;
    let savedArgs = null;
    let savedThis = null;
    return function wrapper(...args) {
        if (isWaiting) {
            savedArgs = args;
            savedThis = this;
            return;
        }

        callback.apply(this, args);

        isWaiting = true;
        setTimeout(() => {
            isWaiting = false;
            if (savedThis) {
                wrapper.apply(savedThis, savedArgs);
                savedThis = null;
                savedArgs = null;
            }
        }, delay);
    }
}


