/* CRISC 5-Day Faculty Workshop: shared lesson behavior (flashcards, expand, quiz). Light only. */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    // ---- Flashcards ----
    document.querySelectorAll('.flip-card').forEach(function (card) {
      card.addEventListener('click', function () {
        card.setAttribute('aria-pressed', card.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
      });
    });

    // ---- Shared interactive expand ----
    document.querySelectorAll('.iw-expand').forEach(function (btn) {
      var iw = btn.closest('.iw');
      if (!iw) return;
      var backdrop = null;
      function esc(e) { if (e.key === 'Escape' && iw.classList.contains('is-expanded')) btn.click(); }
      btn.addEventListener('click', function () {
        var on = iw.classList.toggle('is-expanded');
        btn.setAttribute('aria-expanded', on ? 'true' : 'false');
        btn.innerHTML = on ? '&#10005; Close' : '&#10530; Expand';
        if (on) {
          backdrop = document.createElement('div');
          backdrop.className = 'iw-backdrop';
          backdrop.addEventListener('click', function () { btn.click(); });
          document.body.appendChild(backdrop);
          document.body.style.overflow = 'hidden';
          document.addEventListener('keydown', esc);
        } else {
          if (backdrop) { backdrop.remove(); backdrop = null; }
          document.body.style.overflow = '';
          document.removeEventListener('keydown', esc);
        }
        window.dispatchEvent(new Event('resize'));
      });
    });
  });

  // ---- Quiz: marks the chosen and the correct option, shows every rationale ----
  window.gradeQuiz = function () {
    var form = document.getElementById('quiz');
    if (!form) return;
    var qs = form.querySelectorAll('.q');
    var score = 0, answered = 0;
    qs.forEach(function (q) {
      var ans = q.getAttribute('data-answer');
      q.querySelectorAll('.opt').forEach(function (o) { o.classList.remove('correct', 'wrong'); });
      var chosen = q.querySelector('input:checked');
      var right = q.querySelector('input[value="' + ans + '"]');
      if (chosen) {
        answered++;
        if (chosen.value === ans) { score++; chosen.closest('.opt').classList.add('correct'); }
        else { chosen.closest('.opt').classList.add('wrong'); if (right) right.closest('.opt').classList.add('correct'); }
      } else if (right) { right.closest('.opt').classList.add('correct'); }
      var r = q.querySelector('.rationale'); if (r) r.classList.add('show');
    });
    var el = document.getElementById('score');
    if (el) el.innerHTML = 'Score: <span>' + score + ' / ' + qs.length + '</span>' +
      (answered < qs.length ? ' &middot; ' + (qs.length - answered) + ' unanswered' : '');
  };

  window.resetQuiz = function () {
    var form = document.getElementById('quiz');
    if (!form) return;
    form.reset();
    form.querySelectorAll('.opt').forEach(function (o) { o.classList.remove('correct', 'wrong'); });
    form.querySelectorAll('.rationale').forEach(function (r) { r.classList.remove('show'); });
    var el = document.getElementById('score');
    if (el) el.textContent = '';
  };
})();
