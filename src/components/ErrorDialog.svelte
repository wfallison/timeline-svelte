<script lang="ts">
  import Banner, { Label } from '@smui/banner';
  import Button from '@smui/button';

</script>
<Banner open fixed mobileStacked content$style="max-width: max-content;">
  <Label slot="label">
    Oh no! We're having some trouble finding that for you.
  </Label>
  <Button style="color:white; float:right;" slot="actions">Close</Button>
</Banner>

<style></style>
