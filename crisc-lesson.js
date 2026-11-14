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
      function esc(e) {
        if (!iw.classList.contains('is-expanded')) return;
        if (e.key === 'Escape') { btn.click(); btn.focus(); return; }
        if (e.key === 'Tab') {
          var f = Array.prototype.filter.call(iw.querySelectorAll('a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'), function (x) { return !x.disabled && x.offsetParent !== null; });
          if (!f.length) return;
          var first = f[0], last = f[f.length - 1];
          if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
          else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      }
      btn.addEventListener('click', function () {
        var on = iw.classList.toggle('is-expanded');
        btn.setAttribute('aria-expanded', on ? 'true' : 'false');
        btn.innerHTML = on ? '&#10005; Close' : '&#10530; Expand';
        if (on) {
          iw.setAttribute('role', 'dialog'); iw.setAttribute('aria-modal', 'true');
          var sec = iw.closest('.content-section'), ttl = (sec && sec.querySelector('h3')) || iw.querySelector('.iw-eyebrow');
          if (ttl) iw.setAttribute('aria-label', ttl.textContent.trim() + ' (expanded)');
          backdrop = document.createElement('div');
          backdrop.className = 'iw-backdrop';
          backdrop.addEventListener('click', function () { btn.click(); });
          document.body.appendChild(backdrop);
          document.body.style.overflow = 'hidden';
          document.addEventListener('keydown', esc);
        } else {
          iw.removeAttribute('role'); iw.removeAttribute('aria-modal'); iw.removeAttribute('aria-label');
          if (backdrop) { backdrop.remove(); backdrop = null; }
          document.body.style.overflow = '';
          document.removeEventListener('keydown', esc);
        }
        window.dispatchEvent(new Event('resize'));
      });
    });
  });

  // ---- Quiz: marks the chosen and the correct option with text and a glyph (not color alone),
  //      shows every rationale. The #score span is a polite live region in each lesson.
  function clearMarks(form) {
    form.querySelectorAll('.opt').forEach(function (o) { o.classList.remove('correct', 'wrong'); });
    form.querySelectorAll('.opt-mark').forEach(function (m) { m.remove(); });
  }
  function mark(opt, kind, text) {
    opt.classList.add(kind);
    var s = document.createElement('span');
    s.className = 'opt-mark ' + kind;
    s.textContent = (kind === 'correct' ? '\u2713 ' : '\u2715 ') + text;
    opt.appendChild(s);
  }
  window.gradeQuiz = function () {
    var form = document.getElementById('quiz');
    if (!form) return;
    var qs = form.querySelectorAll('.q');
    var el = document.getElementById('score');
    var answered = form.querySelectorAll('.q input:checked').length;
    if (!answered) {
      if (el) el.textContent = 'Choose an answer for at least one question, then select Submit Answers.';
      return;
    }
    clearMarks(form);
    var score = 0;
    qs.forEach(function (q) {
      var ans = q.getAttribute('data-answer');
      var chosen = q.querySelector('input:checked');
      var right = q.querySelector('input[value="' + ans + '"]');
      if (chosen) {
        if (chosen.value === ans) { score++; mark(chosen.closest('.opt'), 'correct', 'Your answer: correct'); }
        else { mark(chosen.closest('.opt'), 'wrong', 'Your answer: not the best choice'); if (right) mark(right.closest('.opt'), 'correct', 'Best answer'); }
      } else if (right) { mark(right.closest('.opt'), 'correct', 'Best answer (you skipped this one)'); }
      var r = q.querySelector('.rationale'); if (r) r.classList.add('show');
    });
    if (el) el.innerHTML = 'Self-check: <span>' + score + ' of ' + qs.length + '</span> best answers' +
      (answered < qs.length ? ' &middot; ' + (qs.length - answered) + ' skipped' : '') + '. Read each explanation below.';
  };

  window.resetQuiz = function () {
    var form = document.getElementById('quiz');
    if (!form) return;
    form.reset();
    clearMarks(form);
    form.querySelectorAll('.rationale').forEach(function (r) { r.classList.remove('show'); });
    var el = document.getElementById('score');
    if (el) el.textContent = '';
    var first = form.querySelector('input'); if (first) first.focus();
  };
})();
