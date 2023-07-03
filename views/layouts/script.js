<script>
  function deleteFile(id) {
    fetch(`/files/delete/${id}`, {
      method: 'DELETE'
    })
      .then(response => {
        if (response.ok) {
          window.location.href = '/files'; // Redirect to the files page after successful deletion
        } else {
          throw new Error('Error deleting file');
        }
      })
      .catch(err => {
        console.error(err);
        alert('An error occurred while deleting the file');
      })
    }
</script>