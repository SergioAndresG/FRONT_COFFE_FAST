<template>

<div class="container">
    <div class="bubbles">
        <span style="--i:5;"></span>
        <span style="--i:1;"></span>
        <span style="--i:2;"></span>
        <span style="--i:3;"></span>
        <span style="--i:4;"></span>
        <span style="--i:5;"></span>
        <span style="--i:6;"></span>
        <span style="--i:8;"></span>
        <span style="--i:5;"></span>
        <span style="--i:1;"></span>
        <span style="--i:1;"></span>
        <span style="--i:3;"></span>
        <span style="--i:5;"></span>
        <span style="--i:6;"></span>
        <span style="--i:8;"></span>
        <span style="--i:2;"></span>
        <span style="--i:6;"></span>
        <span style="--i:7;"></span>
        <span style="--i:8;"></span>
        <span style="--i:9;"></span>
        <span style="--i:1;"></span>
        <span style="--i:2;"></span>
        <span style="--i:1;"></span>
        <span style="--i:2;"></span>
        <span style="--i:2;"></span>
        <span style="--i:4;"></span>
        <span style="--i:4;"></span>
        <span style="--i:5;"></span>
        <span style="--i:3;"></span>
        <span style="--i:0;"></span>
        <span style="--i:8;"></span>
        <span style="--i:3;"></span>
        <span style="--i:3;"></span>
        <span style="--i:6;"></span>
    </div>
</div>

</template>
  
<style scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
.container {
    position: fixed; /* Asegura que permanezca fija en el fondo */
    width: 100%;
    height: 100%;
    overflow: visible;
    margin: 0; /* Elimina el margen para que no desplace el contenido */
}
.bubbles {
    position: absolute; /* Asegura que las burbujas sigan al contenedor */
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    padding: 34px;
    margin: 34px;
    overflow: visible;
    justify-content: space-evenly;
}
.bubbles span {
    position: relative;
    width: 1px;
    height: 1px;
    background-color: rgba(255, 255, 255, 0.382);
    margin: 0 1px;
    border-radius: 50%;
    box-shadow: 0 0 0 10px #d9ab2358, 0 0 0 10px,0 0 0 10px #592e2564;
    animation: animate 15s linear infinite;
    animation-duration: calc(165s/ var(--i));
}
.bubbles span:nth-child(even){
    background-color: brown;
    box-shadow: 0 0 0 10px #a64e4e, 0 0 0 10px green, 0 0 0 10px greenyellow;
}
@keyframes animate {
    0% {
        transform:  translateY(100vh) scale(0);
    }
    100% {
        transform: translateY(-10vh) scale(1)
    }
}
</style>