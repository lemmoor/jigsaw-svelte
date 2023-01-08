<script>
    import { createEventDispatcher} from 'svelte';

    const dispatch = createEventDispatcher();
    const close = () => dispatch('close');
</script>

<div class="modal">
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
        max-width: 50rem;
        min-height: 40rem;
        padding: 2rem;
        /* margin: 1rem; */
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;

        /* background: rgba(192, 192, 192, 0.3);
        box-shadow: 0 8px 32px 0 rgba( 31, 38, 135, 0.37 );
        backdrop-filter: blur( 8px );
        -webkit-backdrop-filter: blur( 8px );
        border-radius: 10px;
        border: 1px solid rgba( 255, 255, 255, 0.18 );

        color: white; */

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