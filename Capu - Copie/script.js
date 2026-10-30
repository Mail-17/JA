var cv = document.getElementById('c'),
    ctx = cv.getContext('2d'),
    gift = document.getElementById('gift'),
    P = [],
    run = false,
    opened = false;
var colors = ['#f5cf7a', '#e8b552', '#ff5c8a', '#64b5f6', '#69f0ae', '#ba68c8', '#ffffff', '#ff8a3d'];

function size() {
  cv.width = innerWidth;
  cv.height = innerHeight;
}
size();
addEventListener('resize', size);

// Point d'où sortent les confettis : l'ouverture de la boîte
function opening() {
  var r = gift.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height * 0.42 };
}

// Les confettis jaillissent vers le haut, en éventail, puis retombent
function burst(n) {
  var o = opening();
  for (var i = 0; i < n; i++) {
    var a = -Math.PI / 2 + (Math.random() - 0.5) * 1.7,
        s = 9 + Math.random() * 13;
    P.push({
      x: o.x + (Math.random() - 0.5) * 80,
      y: o.y,
      vx: Math.cos(a) * s,
      vy: Math.sin(a) * s,
      w: 6 + Math.random() * 7,
      h: 4 + Math.random() * 6,
      r: Math.random() * 6,
      vr: (Math.random() - 0.5) * 0.4,
      round: Math.random() < 0.25,
      c: colors[i % colors.length],
      life: 170 + Math.random() * 90
    });
  }
  if (!run) { run = true; loop(); }
}

function loop() {
  ctx.clearRect(0, 0, cv.width, cv.height);
  for (var i = P.length - 1; i >= 0; i--) {
    var p = P[i];
    p.vy += 0.25; p.vx *= 0.99;
    p.x += p.vx; p.y += p.vy;
    p.r += p.vr; p.life--;
    if (p.life <= 0 || p.y > cv.height + 20) { P.splice(i, 1); continue; }
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.r);
    ctx.globalAlpha = Math.min(1, p.life / 40);
    ctx.fillStyle = p.c;
    if (p.round) {
      ctx.beginPath(); ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2); ctx.fill();
    } else {
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    }
    ctx.restore();
  }
  if (P.length) { requestAnimationFrame(loop); } else { run = false; }
}

function reveal() {
  document.getElementById('msg').classList.add('show');
  document.getElementById('name').classList.add('show');
  document.getElementById('hint').textContent = 'Clique encore pour plus de confettis ! 🎊';
  burst(170);
  setTimeout(function () { burst(90); }, 300);
  setTimeout(function () { burst(60); }, 650);
}

gift.addEventListener('click', function () {
  if (!opened) {
    opened = true;
    document.getElementById('hint').textContent = '';
    // 1. le cadeau tremble, 2. le couvercle saute, 3. le message et les confettis sortent
    gift.classList.add('wiggle');
    setTimeout(function () {
      gift.classList.remove('wiggle');
      gift.classList.add('open');
    }, 450);
    setTimeout(reveal, 600);
  } else {
    burst(100);
  }
});
