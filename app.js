var cards = [
  { q: "What does DOM stand for?", a: "Document Object Model", tag: "DOM", known: false },
  { q: "How do you select an element by id?", a: "document.getElementById('id')", tag: "DOM", known: false },
  { q: "Which method adds an event listener?", a: "element.addEventListener(type, handler)", tag: "Events", known: false },
  { q: "Which property gives you the clicked element inside a handler?", a: "event.target", tag: "Events", known: false },
  { q: "How do you loop over an array?", a: "Use for, forEach, for...of, etc.", tag: "Arrays", known: false },
  { q: "Which array method returns a new array with items that match a test?", a: "filter(callback)", tag: "Arrays", known: false },
];

var currentIndex = 0;
var showAnswer = false;
var visibleCards = cards.slice();

var tagFilter = document.getElementById('tagFilter');
var searchInput = document.getElementById('search');
var cardEl = document.getElementById('card');
var cardQuestion = document.getElementById('cardQuestion');
var cardAnswer = document.getElementById('cardAnswer');
var frontTag = document.getElementById('frontTag');
var backTag = document.getElementById('backTag');
var cardCounter = document.getElementById('cardCounter');
var cardCounterBack = document.getElementById('cardCounterBack');
var knownIndicator = document.getElementById('knownIndicator');
var showBtn = document.getElementById('showBtn');
var knownBtn = document.getElementById('knownBtn');
var nextBtn = document.getElementById('nextBtn');
var shuffleBtn = document.getElementById('shuffleBtn');
var totalCount = document.getElementById('totalCount');
var knownCount = document.getElementById('knownCount');
var remainingCount = document.getElementById('remainingCount');
var progressBar = document.getElementById('progressBar');

function init() {
  populateTagOptions();
  applyFilters();
  updateProgressBar();
  
  document.querySelector('.container').style.opacity = '0';
  document.querySelector('.container').style.transform = 'translateY(20px)';
  document.querySelector('.container').style.transition = 'all 0.5s ease';
  
  setTimeout(() => {
    document.querySelector('.container').style.opacity = '1';
    document.querySelector('.container').style.transform = 'translateY(0)';
  }, 100);
}

function populateTagOptions() {
  tagFilter.innerHTML = "";
  var allOpt = document.createElement('option');
  allOpt.value = "all"; 
  allOpt.textContent = "All Topics";
  tagFilter.appendChild(allOpt);
  
  var unique = new Set();
  cards.forEach(c => unique.add(c.tag));
  
  Array.from(unique).forEach(tag => {
    var opt = document.createElement('option');
    opt.value = tag; 
    opt.textContent = tag;
    tagFilter.appendChild(opt);
  });
}

function applyFilters() {
  var topic = tagFilter.value;
  var query = searchInput.value.toLowerCase();
  var arr = cards.slice();
  
  if (topic !== "all") {
    arr = arr.filter(c => c.tag === topic);
  }
  
  if (query !== "") {
    arr = arr.filter(c => 
      c.q.toLowerCase().includes(query) || 
      c.a.toLowerCase().includes(query)
    );
  }
  
  visibleCards = arr; 
  currentIndex = 0; 
  showAnswer = false;
  render();
  updateProgressBar();
}

function render() {
  totalCount.textContent = visibleCards.length;
  var knownInVisible = visibleCards.filter(c => c.known).length;
  knownCount.textContent = knownInVisible;
  remainingCount.textContent = visibleCards.length - knownInVisible;

  if (visibleCards.length === 0) {
    cardQuestion.textContent = "No cards match your search criteria.";
    cardAnswer.textContent = "Try changing your filters or search term.";
    frontTag.textContent = "";
    backTag.textContent = "";
    cardCounter.textContent = "";
    cardCounterBack.textContent = "";
    knownIndicator.style.display = 'none';
    cardEl.classList.remove('flipped');
    return;
  }

  if (currentIndex < 0) currentIndex = 0;
  if (currentIndex >= visibleCards.length) currentIndex = 0;

  var card = visibleCards[currentIndex];
  
  cardQuestion.textContent = card.q;
  cardAnswer.textContent = card.a;
  frontTag.textContent = card.tag;
  backTag.textContent = card.tag;
  

  cardCounter.textContent = `${currentIndex + 1} / ${visibleCards.length}`;
  cardCounterBack.textContent = `${currentIndex + 1} / ${visibleCards.length}`;

  if (showAnswer) {
    cardEl.classList.add('flipped');
    showBtn.innerHTML = '<i class="fas fa-eye-slash"></i> Hide Answer';
  } else {
    cardEl.classList.remove('flipped');
    showBtn.innerHTML = '<i class="fas fa-eye"></i> Show Answer';
  }
  
  if (card.known) {
    knownIndicator.style.display = 'flex';
  } else {
    knownIndicator.style.display = 'none';
  }
}

function updateProgressBar() {
  if (visibleCards.length === 0) {
    progressBar.style.width = '0%';
    return;
  }
  
  var knownInVisible = visibleCards.filter(c => c.known).length;
  var progress = (knownInVisible / visibleCards.length) * 100;
  progressBar.style.width = `${progress}%`;
}

function nextCard() {
  cardEl.style.opacity = '0';
  cardEl.style.transform = 'translateX(30px) rotateY(180deg)';
  
  setTimeout(() => {
    currentIndex = (currentIndex + 1) % visibleCards.length;
    showAnswer = false;
    render();
    
    cardEl.style.opacity = '1';
    cardEl.style.transform = 'translateX(0) rotateY(0deg)';
  }, 300);
}

function markKnown() {
  if (visibleCards.length === 0) return;
  
  knownBtn.style.transform = 'scale(1.1)';
  setTimeout(() => {
    knownBtn.style.transform = 'scale(1)';
  }, 150);
  
  var visibleCard = visibleCards[currentIndex];
  var originalIndex = cards.findIndex(c => 
    c.q === visibleCard.q && c.a === visibleCard.a
  );
  
  if (originalIndex !== -1) {
    cards[originalIndex].known = true;
    visibleCards[currentIndex].known = true;
  }
  
  render();
  updateProgressBar();
  
  setTimeout(nextCard, 1000);
}

function shuffleVisible() {
  // تأثير الخلط
  shuffleBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Shuffling';
  
  setTimeout(() => {
    for (var i = visibleCards.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      [visibleCards[i], visibleCards[j]] = [visibleCards[j], visibleCards[i]];
    }
    currentIndex = 0;
    showAnswer = false;
    render();
    
    shuffleBtn.innerHTML = '<i class="fas fa-random"></i> Shuffle Cards';
  }, 500);
}

function toggleCardFlip() {
  showAnswer = !showAnswer;
  render();
}

tagFilter.addEventListener('change', applyFilters);
searchInput.addEventListener('input', applyFilters);
showBtn.addEventListener('click', toggleCardFlip);
knownBtn.addEventListener('click', markKnown);
nextBtn.addEventListener('click', nextCard);
shuffleBtn.addEventListener('click', shuffleVisible);

cardEl.addEventListener('click', toggleCardFlip);

cardEl.addEventListener('keydown', e => {
  if (e.code === 'Space' || e.code === 'Enter') { 
    e.preventDefault(); 
    if (e.code === 'Space') toggleCardFlip();
    if (e.code === 'Enter') markKnown();
  }
});

init();