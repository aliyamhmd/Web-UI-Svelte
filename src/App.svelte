<script>
  import { onMount } from 'svelte';
  import { supabase } from './supabaseClient';

  let displayName = '';
  let displayPhone = '';
  let count = 0;
  let inputName = '';
  let inputPhone = '';
  let editingId = null;
  let contacts = [];

  async function fetchContacts() {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.error('Gagal mengambil data:', error);
    } else {
      contacts = data;
    }
  }

  onMount(() => {
    fetchContacts();
  });

  function handleCounter() {
    count += 1;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!inputName || !inputPhone) {
      alert('Isi nama dan nomor telepon terlebih dahulu!');
      return;
    }

    if (editingId) {

      const { error } = await supabase
        .from('contacts')
        .update({ name: inputName, phone: inputPhone })
        .eq('id', editingId);

      if (error) {
        alert('Gagal memperbarui data: ' + error.message);
        return;
      }
      editingId = null;
    } else {

      const { error } = await supabase
        .from('contacts')
        .insert([{ name: inputName, phone: inputPhone }]);

      if (error) {
        alert('Gagal menambah data: ' + error.message);
        return;
      }
    }

    displayName = inputName;
    displayPhone = inputPhone;
    inputName = '';
    inputPhone = '';
    fetchContacts();
  }

  function handleEdit(item) {
    editingId = item.id;
    inputName = item.name;
    inputPhone = item.phone;
  }

  function cancelEdit() {
    editingId = null;
    inputName = '';
    inputPhone = '';
  }

  async function handleDelete(id) {
    if (confirm('Yakin ingin menghapus kontak ini?')) {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id);

      if (error) {
        alert('Gagal menghapus data: ' + error.message);
      } else {
        fetchContacts();
      }
    }
  }
</script>

<main class="container">
  {#if displayName && displayPhone}
    <h1 class="text-orange">Name: {displayName}</h1>
    <h1 class="text-orange">Phone: {displayPhone}</h1>
  {/if}

  <div class="count-text">Count: {count}</div>

  <button class="btn-click" onclick={handleCounter}>Click Me</button>

  <form onsubmit={handleSubmit} class="form-group">
    <input
      type="text"
      placeholder="Enter your name"
      bind:value={inputName}
    />
    <input
      type="text"
      placeholder="Enter your phone number"
      bind:value={inputPhone}
    />
    <button type="submit" class="btn-submit">
      {editingId ? 'Update' : 'Submit'}
    </button>
    
    {#if editingId}
      <button type="button" class="btn-cancel" onclick={cancelEdit}>Batal</button>
    {/if}
  </form>

  <!-- Tabel Data Kontak (Di Bawah Form) -->
  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th>No</th>
          <th>Nama</th>
          <th>Nomor Telepon</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>
        {#if contacts.length === 0}
          <tr>
            <td colspan="4" style="text-align: center;">Belum ada data.</td>
          </tr>
        {:else}
          {#each contacts as item, index}
            <tr>
              <td>{index + 1}</td>
              <td>{item.name}</td>
              <td>{item.phone}</td>
              <td>
                <button class="btn-edit" onclick={() => handleEdit(item)}>Edit</button>
                <button class="btn-delete" onclick={() => handleDelete(item.id)}>Hapus</button>
              </td>
            </tr>
          {/each}
        {/if}
      </tbody>
    </table>
  </div>
</main>

<style>
  :global(body) {
    background-color: #121319;
    color: white;
    font-family: sans-serif;
    margin: 0;
  }

  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    text-align: center;
  }

  .text-orange {
    color: #ff4500;
    font-size: 2.5rem;
    margin: 10px 0;
  }

  .count-text {
    color: #1e90ff;
    font-size: 1.2rem;
    margin: 15px 0 5px 0;
  }

  .btn-click {
    width: 100%;
    background-color: #333;
    color: white;
    border: 1px solid #666;
    padding: 6px;
    cursor: pointer;
    margin-bottom: 15px;
  }

  .form-group {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-bottom: 30px;
  }

  .form-group input {
    background-color: #222;
    border: 1px solid #555;
    color: white;
    padding: 6px 12px;
  }

  .btn-submit {
    background-color: #e0e0e0;
    color: black;
    border: none;
    padding: 6px 15px;
    cursor: pointer;
  }

  .btn-cancel {
    background-color: #ff4d4d;
    color: white;
    border: none;
    padding: 6px 15px;
    cursor: pointer;
  }

  .table-container {
    margin-top: 20px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    background-color: #1e1e24;
    color: #fff;
  }

  th, td {
    border: 1px solid #444;
    padding: 10px;
    text-align: left;
  }

  th {
    background-color: #2a2a32;
    color: #ff4500;
  }

  .btn-edit {
    background-color: #494948;
    border: none;
    color: black;
    padding: 4px 8px;
    cursor: pointer;
    margin-right: 5px;
    border-radius: 3px;
  }

  .btn-delete {
    background-color: #dc3545;
    border: none;
    color: white;
    padding: 4px 8px;
    cursor: pointer;
    border-radius: 3px;
  }
</style>