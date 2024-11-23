<template>
  <div class="contenedor">
    <img src="https://i.postimg.cc/Y9CYNsC4/Whats-App-Image-2024-11-22-at-3-56-15-PM.jpg" class="imagen" alt="imagen 1">
  </div>
</template>

<style>
.imagen {
  display: flex;
  height: 230px;
  width: 260px; 
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