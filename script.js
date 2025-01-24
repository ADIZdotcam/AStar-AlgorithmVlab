document.addEventListener('DOMContentLoaded', function () {
    // head nav
    const header = document.querySelector('.header');
    window.addEventListener('scroll', function () {
        if (window.scrollY > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });


    const searchButton = document.getElementById('searchbt');
    searchButton.addEventListener('click', performSearch);

});

let topicElements = {
    'aim': document.getElementById('aim'),
    'theory': document.getElementById('theory'),
    'procedure': document.getElementById('procedure'),
    'practice': document.getElementById('practice'),
    'code': document.getElementById('code'),
    'result': document.getElementById('result'),
    'quiz': document.getElementById('quiz'),
    'references': document.getElementById('references'),
    'tnt': document.getElementById('tnt')
};
let currentTopic = 'aim'; // Default topic


function switchContent(topic) {
    if (topic === currentTopic) {
        return;
    }

    topicElements[currentTopic].style.display = 'none';
    topicElements[topic].style.display = 'block';
    currentTopic = topic;
}
