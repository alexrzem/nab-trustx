let container;
let dragHandle;

function showSheet(title, text, primaryButton, secondaryButton, icon, notification) {
    const sheet = document.createElement('dialog')
    sheet.id = 'sheet';

    const scrim = document.createElement('div')
    scrim.id = 'sheet-scrim'
    scrim.onclick = closeSheet;
    sheet.appendChild(scrim)

    container = document.createElement('container')
    container.id = 'sheet-container';
    sheet.appendChild(container)

    // dragHandle = document.createElement("div")
    // dragHandle.id = 'sheet-drag-handle';
    // container.appendChild(dragHandle)
    //
    // dragHandle.onmousedown = startDrag

    const body = document.createElement('body')
    body.id = 'sheet-body';
    container.appendChild(body)

    if (icon) {
        const iconElement = document.createElement('i');
        iconElement.className = 'material-icons ' + icon.theme
        iconElement.id = 'sheet-icon'
        iconElement.textContent = icon.name
        body.appendChild(iconElement)
    }

    const header = document.createElement('h2')
    header.id = 'sheet-header'
    header.textContent = title
    body.appendChild(header)

    if (notification) {
        const notificationPanel = document.createElement('div')
        notificationPanel.className = 'notification-panel notification-panel-warning'
        notificationPanel.id = 'sheet-notification'

        const notificationIcon = document.createElement('div')
        notificationIcon.className = 'notification-icon'
        const notificationIconSymbol = document.createElement('i')
        notificationIconSymbol.className = 'material-symbols-outlined'
        notificationIconSymbol.textContent = 'warning'
        notificationIcon.appendChild(notificationIconSymbol)

        notificationPanel.appendChild(notificationIcon)

        const notificationContent = document.createElement('div')
        notificationContent.className = 'notification-content'
        notificationContent.textContent = notification
        notificationPanel.appendChild(notificationContent)

        body.appendChild(notificationPanel)
    }

    const content = document.createElement('div')
    content.id = 'sheet-content';

    text.forEach((para) => {
        const paragraph = document.createElement('p')
        paragraph.textContent = para;
        content.appendChild(paragraph)
    })

    body.appendChild(content)


    const buttonsContainer = document.createElement('div')
    buttonsContainer.id = 'sheet-buttons-container';
    body.appendChild(buttonsContainer)

    if (primaryButton) {
        const primaryButtonDiv = document.createElement('md-filled-button')
        primaryButtonDiv.className = 'next-button'
        primaryButtonDiv.onclick = primaryButton.onclick;
        primaryButtonDiv.textContent = primaryButton.label;
        buttonsContainer.appendChild(primaryButtonDiv)
    }

    if (secondaryButton) {
        const secondaryButtonDiv = document.createElement('md-text-button')
        secondaryButtonDiv.onclick = secondaryButton.onclick;
        secondaryButtonDiv.textContent = secondaryButton.label;
        buttonsContainer.appendChild(secondaryButtonDiv)
    }

    document.body.appendChild(sheet)

    document.body.style.overflow = 'hidden';
    sheet.showModal();

    const timings = {
        easing: 'cubic-bezier(0.05, 0.7, 0.1, 1)',
        duration: 550,
        fill: 'forwards'
    }

    const scrimStyle = {
        opacity: [ '0', '0.32' ]
    }

    scrim.animate(scrimStyle, timings)

    const dialogStyle = {
        opacity: [ '0', '1' ]
    }

    sheet.animate(dialogStyle, timings)

    const style = {
        transform: [ `translateY(100%)`, 'translateY(0)' ]
    }

    container.animate(style, timings)
}

function startDrag() {
    console.log('starting!')
    originalTop = dragHandle.getBoundingClientRect().top
    document.addEventListener('mousemove', moveSheet, false)
    document.addEventListener('mouseup', endDrag, false)
}

let originalTop;

function moveSheet(e) {
    if (e.clientY > originalTop) {
        const delta = document.body.clientHeight - originalTop;
        const mouseDiff = document.body.clientHeight - e.clientY;

        const percentage = (1 - (mouseDiff / delta)) * 100;

        container.setAttribute('style', `transform: translateY(${percentage}%) !important`)
    }
}

function endDrag() {
    document.removeEventListener('mousemove', moveSheet)
    document.removeEventListener('mouseup', endDrag)
    container.removeAttribute('style');
}

function closeSheet() {
    const promises = []

    const sheet = document.getElementById("sheet");
    const scrim = document.getElementById('sheet-scrim');
    const container = document.getElementById('sheet-container')

    // Clear previous animations
    scrim.getAnimations().forEach(anim => anim.cancel());
    sheet.getAnimations().forEach(anim => anim.cancel());
    container.getAnimations().forEach(anim => anim.cancel());

    const timings = {
        easing: 'cubic-bezier(0.3, 0, 0.8, 0.15)',
        duration: 200,
        fill: 'forwards'
    }

    const scrimStyle = {
        opacity: [ '0.32', '0' ]
    }

    promises.push(scrim.animate(scrimStyle, timings).finished)

    const dialogStyle = {
        opacity: [ '1', '0' ]
    }

    promises.push(sheet.animate(dialogStyle, timings).finished)

    const style = {
        transform: [ 'translateY(0)', 'translateY(100%)' ]
    }

    promises.push(container.animate(style, timings).finished)

    Promise.all(promises).then(() => {
        document.body.style.overflow = '';
        sheet.close();
        document.body.removeChild(sheet)
    })
}
