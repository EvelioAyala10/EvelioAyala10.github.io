document.addEventListener('DOMContentLoaded', function() {
  // Selecionar todos os botões de reprodução
  const playButtons = document.querySelectorAll('.play-button');

  // Adicionar evento de clique para cada botão de reprodução
  playButtons.forEach(button => {
    button.addEventListener('click', function(event) {
      event.preventDefault();

      // Obter o vídeo a partir do atributo data-video
      const videoPath = button.getAttribute('data-video');

      // Definir a origem do vídeo no player modal
      const videoPlayer = document.getElementById('video-player');
      const videoSource = document.getElementById('video-source');
      videoSource.setAttribute('src', videoPath);
      videoPlayer.load();

      // Abrir o modal
      const modal = document.getElementById('video-modal');
      modal.style.display = 'block';

      // Fechar o modal ao clicar no botão de fechar (X)
      const closeButton = document.querySelector('.close');
      closeButton.addEventListener('click', function() {
        modal.style.display = 'none';
        videoPlayer.pause();
      });

      // Fechar o modal ao clicar fora do vídeo
      window.addEventListener('click', function(event) {
        if (event.target === modal) {
          modal.style.display = 'none';
          videoPlayer.pause();
        }
      });
    });
  });
});