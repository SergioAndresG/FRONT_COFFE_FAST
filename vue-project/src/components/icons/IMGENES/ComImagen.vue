<template>
  <div class="contenedor">
    <img src="https://i.postimg.cc/QMwjX2vk/Whats-App-Image-2024-11-23-at-10-53-04-PM.jpg" class="imagen" alt="imagen 1">
  </div>
</template>

<style>
.imagen {
  display: flex;
  height: 210px;
  width: 240px; 
  border-radius: 250px;
}
.contenedor{
  display: flex;
}
@media screen and (min-width: 280px) and (max-width: 490px){
  .imagen {
  display: flex;
  height: 80px;
  width: 150px; 
  margin-left: -49px;
  margin-top: -30px;
}
.contenedor{
  display: flex;
}
}
</style>