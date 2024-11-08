
function descriptionTrim(desc, className, otherClass = "") {
    var extandedClass = (otherClass=="")? "": " "+otherClass;
    if(desc.length > 150) {
        return '<p class="' + className + extandedClass +'">' + desc.slice(0, 150) + '<span class="dots">... </span><span class="more-section">'
                 + desc.slice(150, desc.length) + ' </span><span class="collapse-button">Read more</span></p>';
    }

    return '<p class="' + className + extandedClass +'">' + desc + '</p>';
}

function addCollapseFunction() {
    const buttons = document.getElementsByClassName('collapse-button');
    for(let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', function(event) {
            let dots = event.target.parentNode.getElementsByClassName('dots')[0];
            let moreText = dots.nextSibling;

            if(dots.style.display === "none") { // section is expanded
                dots.style.display = "inline";
                event.target.innerText = 'Read more';
                moreText.style.display = 'none';
            } else { // section is collapsed
                dots.style.display = "none";
                event.target.innerText = 'Show less';
                moreText.style.display = 'inline';
            }
        });
    }
}

export {descriptionTrim};
export {addCollapseFunction}
