<template>
  <div>
<h1>Politique de confidentialité</h1>
<h2>Présentation du service et des parties prenantes</h2>
	<p>Ce texte décrit la politique de protection des données saisies sur le présent site, le site du PAE-UTC.</p>

	<p>Ce site est un service fourni par le PAE-UTC à ses membres associatifs et aux membres de la communauté universitaire de l'UTC, dans le cadre de sa mission de gestion des salles de musique et de danse.</p>

	<p>L'utilisation par les membres associatifs est encadrée par les différents textes réglementaires régissant les relations entre le PAE-UTC et les membres associatifs de la fédération, notamment les statuts et le règlement intérieur du PAE-UTC.</p>

	<p>L'utilisation par les membres de la communauté universitaire de l'UTC se fait conformémement aux différents textes en vigueur notamment la charte informatique de l'UTC.</p>

	<p>Ce site est développé et maintenu par des bénévoles du PAE-UTC et de la fédération du BDE-UTC.</p>

	<h3>PAE-UTC</h3>
	<p>
	Pôle Artistique et Evénementiel de l'Université de Technologie de Compiègne<br/>
	Sigle officiel: PAE-UTC<br/>
	Siret: 53236661400016<br/>
	Siège social:<br/>
	UTC - Centre Benjamin Franklin<br/>
	MDE<br />
	PAE-UTC<br />
	Rue Roger Couttolenc<br />
	60200 Compiègne</p>

	<h3>BDE-UTC</h3>
	<p>
	Bureau des étudiants de l'Université de Technologie de Compiègne<br/>
	Sigle officiel: BDE-UTC<br />
	Siret: 39777672500012<br />
	Siège social:<br/>
	UTC - Centre Benjamin Franklin<br/>
	MDE<br />
	BDE-UTC<br />
	Rue Roger Couttolenc<br />
	60200 Compiègne</p>


    <h2>Informations personnelles</h2>
    <h3>Données collectées</h3>
    <p>Lorsque vous vous connectez pour la première fois à ce site, il est nécessaire, pour l'administration des salles, que ce site collecte des données qui lui sont fournies par le portail des assos. Ces données sont:
    </p>
    <ul>
      <li>Nom et Prénom</li>
      <li>Adresse Email étudiante</li>
      <li>
        Votre appartenance à une des associations suivantes du PAE UTC :
        <ul>
          <li v-for="asso in assos" :key="asso.id">{{ asso.name }}</li>
        </ul>
      </li>
    </ul>
    <p>Il est nécessaire de connaître les associations auxquelles vous appartenez pour vérifier si vous avez le droit de faire des réservations au nom de ces associations.
    ><p>Vos réservations sont également collectées (date, heure, salle, association utilisatrice le cas échéant). Il est nécessaire de traiter ces informations pour fournir le service d'emploi du temps des salles.
    </p>
<p>Si vous ne souhaitez pas utiliser le portail des assos pour transmettre ces données au PAE-UTC, vous pouvez le faire en contactant le PAE-UTC à son adresse mail : <a href="mailto:poleae@assos.utc.fr">poleae@assos.utc.fr</a>. Ces données seront entrées par le PAE-UTC sur ce site et seront soumises à la présente polique de protection des données en ce qui concerne leur traitement.</p>

<h2>Traitements effectués sur les données</h2>
<h3>Stockage et consultation</h3>
	<p>L'ensemble des données listées ci-dessus sont sont stockées pour une durée de un an maximum.
	</p>
	<p>L'ensemble de ces données sont consultées par le PAE-UTC pour gérer l'utilisation des salles.</p>
	<p>Les autres utilisateurs des salles du PAE-UTC peuvent consulter ces données dans le but de faciliter l'attribution des créneaux. Vous pouvez, si vous le souhaitez, communiquer votre nom aux autres utilisateurs des salles afin de faciliter la négociation des créneaux.</p>
	<p>Pour exercer vos droits (consultation, rectification et suppression), vous pouvez contacter le PAE-UTC à l'adresse <a href="mailto:poleae@assos.utc.fr">poleae@assos.utc.fr</a>.</p>

    <h4>Sous-traitants au sens du RGPD pour ce traitement</h4>
<ul>
	<li>Luc varoqui
		<ul>
			<li>OVH</li>
		</ul>
	</li>
</ul>
	<h5>Luc Varoqui</h5>
	<p>Luc Varoqui fournit bénévolement au PAE-UTC un service un service consistant en l'hébergement et la maintenance du site. Cela inclut le stockage de l'ensemble des données traitées par le site.</p>

	<h5>OVH</h5>
	<p>
	L'infrastructure fournie par Luc Varoqui est hébergée par SAS OVH<br />
	2 rue Kellermann BP 80157 59100 Roubaix -France<br />
	Site internet : <a href="https://www.ovh.com/">www.ovh.com</a><br />
	</p>
	
	<p>Ces deux sous-traitants, de facto, ont accès aux données stockées. Ils ne sont pas censés les consulter ou les modifier. Cependant, il est possible que dans l'exercice de leurs fonctions, pour des besoins de maintenance ou de sécurité, ils aient besoin de les consulter ou de les rectifier.</p>

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
  data() {
    return {
      assos: []
    }
  },
  mounted() {
    this.$axios
      .get('/assos')
      .then(({ data }) => {
        this.assos = data
      })
      .catch((err) => {
        console.error(err)
      })
  },
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
