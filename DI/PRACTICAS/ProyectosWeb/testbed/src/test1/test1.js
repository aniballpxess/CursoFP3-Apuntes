const body = document.getElementsByTagName('BODY').item(0);
const content = document.createElement('div');
const btn = document.createElement('button');
const tv = document.createElement('div');

btn.textContent = 'Click Me!';
body.style.display = 'flexbox';
body.style.alignContent = 'center';
body.style.justifyContent = 'center';

content.style.display = 'flexbox';
content.style.alignContent = 'center';
content.style.justifyContent = 'center';
content.style.justifyItems = 'stretch';
content.style.alignItems = 'stretch';
content.setAttribute('height', '240');
content.setAttribute('width', '480');

btn.id = 'button';
btn.style.textAlign = 'center';

tv.id = 'text-view';
tv.style.textAlign = 'center';

body.appendChild(content);
content.append(btn, tv);

btn.addEventListener('click', event => {
    let temp = event.timeStamp / 1000;
    const sec = Math.floor(temp % 60);
    temp = temp / 60;
    const min = Math.floor(temp % 60);
    temp = temp / 60;
    const hour = Math.floor(temp % 24);
    console.log(`${event.type} - ${hour}:${min}:${sec}`);

    if (event.button === 0) {
        const sum = sec + min + hour;
        const sub = sec - min;
        const mult = sec * min;
        const div = sec / min;
        const pow = sec ** min;
        tv.textContent = ` ${sum} | ${sub} | ${mult} | ${div} | ${pow} `;
    }
});

function numberStringFormat(numbers, type, format) {
    const parameters = new Int32Array();
    if (!type instanceof String) {
        throw new Error("Wrong data type for 'type' parameter.");
    }
    if (!format instanceof String) {
        throw new Error("Wrong data type for 'format' parameter.");
    }
    if (!numbers instanceof Int32Array) {
        throw new Error("Wrong data type for 'numbers' parameter.");
    }
    if (numbers instanceof Int32Array && type instanceof String && format instanceof String) {
        switch (type) {
            case 'time':
                parameters.set(0, 0);
                if (format === '24h') {
                    parameters.set(0, 1);
                    break;
                }
                if (format === '12h') {
                    parameters.set(1, 1);
                    break;
                }
                throw new Error("Mismatch of 'type' and 'format' values.");
            default:
                throw new Error("Invalid 'type' value.");
        }
    }
}
