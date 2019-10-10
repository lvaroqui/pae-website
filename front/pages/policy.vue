<template>
  <div>
    <h1>Politique de confidentialité</h1>
    <h2>Informations personnelles</h2>
    <h3>Données collectées</h3>
    <p>
      Lorsque vous acceptez le partage de donnée du portail des assos, les
      données suivantes sont stockées :
    </p>
    <ul>
      <li>Nom et Prénom</li>
      <li>Adresse Email étudiante</li>
      <li>
        Votre appartenance à une des associations suivantes du PAE UTC :
        <ul>
          <li>PAE</li>
          <li>Comédie Musicale</li>
          <li>Stravaganza</li>
          <li>Pic'n'Rock</li>
          <li>Coïncidence</li>
          <li>Salsa'UTC</li>
          <li>Piano-ut's</li>
          <li>UTCrew</li>
          <li>Capharnaüm</li>
          <li>AcoUsTiC</li>
          <li>Flow Raison</li>
          <li>Cheer'UTC</li>
          <li>Acrockeur</li>
          <li>Eden</li>
        </ul>
      </li>
    </ul>
    <p>
      Vos réservations sont également stockées (date, heure, salle, association
      utilisatrice le cas échéant).
    </p>
    <h3>Durée de conservation</h3>
    <p>
      Ces informations, ainsi que toute réservation effectuée sur le site sont
      stockées pour une durée de un an maximum.
    </p>
    <h3>Communication à des tiers</h3>
    <p>
      Aucune des informations dont il est mention ci-dessus n'est communiquée à
      des tiers.
    </p>
    <h2>Hébergement</h2>
    <p>
      Ce site est hébergé par Luc Varoqui pour le PAE UTC. Pour toute question,
      merci de prendre contact à l'adresse
      <a href="mailto:poleae@assos.utc.fr">poleae@assos.utc.fr</a>.
    </p>
    <p>
      Conformément à la loi informatique et liberté du 6 janvier 1978, et au
      Règlement Général sur la Protection des Données (RGPD), vous disposez d'un
      droit d'accès, de rectification et de suppression des informations vous
      concernant. Pour cela, prenez contact avec le PAE UTC :
      <a href="mailto:poleae@assos.utc.fr">poleae@assos.utc.fr</a>.
    </p>
    <h2>Cookies</h2>
    <p>
      Ce site n'utilise pas de traceur. Les seuls cookies utilisés servent au
      maintient de la session en cours.
    </p>
  </div>
</template>

<script>
export default {
  name: 'Policy',
  head() {
    return {
      title: 'Politique de confidentialité'
    }
  }
}
</script>

<style scoped>
p {
  margin-bottom: 5px;
}
ul {
  margin-bottom: 10px;
}
</style>
