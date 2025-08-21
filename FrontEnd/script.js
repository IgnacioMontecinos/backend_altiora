// Animación de nodos conectados
const canvas = document.getElementById("networkCanvas");
if (canvas) {
  const ctx = canvas.getContext("2d");
  let nodes = [];
  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    nodes = [];
    for (let i = 0; i < 40; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5
      });
    }
  }
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    nodes.forEach(n => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
      if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
      ctx.beginPath();
      ctx.arc(n.x, n.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = "#C13C8B";
      ctx.fill();
    });
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        let dx = nodes[i].x - nodes[j].x;
        let dy = nodes[i].y - nodes[j].y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = "rgba(106,13,173,0.2)";
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }
  window.addEventListener("resize", resize);
  resize();
  animate();
}

// Formulario (simulación)
const form = document.getElementById("contactForm");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    document.querySelector(".form-status").innerText = "✅ Mensaje enviado (simulado).";
    form.reset();
  });
}
