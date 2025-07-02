<script lang="ts">
  // No props or data for now
</script>

<div class="table-container">
  <table>
    <thead>
      <tr>
        <th>Header 1</th>
        <th>Header 2</th>
        <th>Header 3</th>
      </tr>
    </thead>
    <tbody>
      <!-- No data yet -->
    </tbody>
  </table>
</div>

<style>
  .table-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 60vh;
  }
  table {
    border-collapse: collapse;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 12px rgba(33, 84, 162, 0.09);
    overflow: hidden;
    min-width: 400px;
  }
  th, td {
    padding: 1rem 1.5rem;
    text-align: left;
  }
  th {
    background: #2154a2;
    color: #fff;
    font-weight: 600;
    font-size: 1.1rem;
    border-bottom: 2px solid #133a6a;
  }
  tr:not(:last-child) td {
    border-bottom: 1px solid #f5f8fa;
  }
</style>
