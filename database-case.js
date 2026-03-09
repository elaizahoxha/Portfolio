const orbitConfigs = [
    {
      selector: ".orbit-1",
      radius: 205
    },
    {
      selector: ".orbit-2",
      radius: 270
    }
  ];
  
  function positionOrbitLabels() {
    orbitConfigs.forEach(config => {
      const orbit = document.querySelector(config.selector);
      if (!orbit) return;
  
      const labels = orbit.querySelectorAll("span");
      const total = labels.length;
      const orbitRect = orbit.getBoundingClientRect();
      const centerX = orbitRect.width / 2;
      const centerY = orbitRect.height / 2;
  
      labels.forEach((label, index) => {
        const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
        const x = centerX + config.radius * Math.cos(angle);
        const y = centerY + config.radius * Math.sin(angle);
  
        label.style.left = `${x}px`;
        label.style.top = `${y}px`;
        label.style.transform = "translate(-50%, -50%)";
      });
    });
  }
  
  window.addEventListener("load", positionOrbitLabels);
  window.addEventListener("resize", positionOrbitLabels);