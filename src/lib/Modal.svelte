<script>
    import { createEventDispatcher} from 'svelte';
    import { fade, scale } from "svelte/transition";

    const dispatch = createEventDispatcher();
    const close = () => dispatch('close');
</script>

<div class="modal" in:scale out:fade>
    <!-- ✕ -->
    <span on:click={close}>&#10005;</span> 
    <div class="modal-content">
        <slot></slot>
    </div> 
</div>

<style>
    span{
        cursor: pointer;
        font-weight: bold;
        font-size: 2rem;
        align-self: flex-end;
    }

    .modal{
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #ffffff;
        width: 100%;
        max-width: 40rem;
        min-height: 35rem;
        padding: 2rem;
        /* margin: 1rem; */
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;

        box-shadow: 0px 0px 25px -9px rgba(66, 68, 90, 1);
    }

    .modal-content {
        display: grid;
        place-items: center;
        place-content: center;
        min-height: 20rem;
        width: 100%;
        font-size: 2.5rem;
    }


</style>