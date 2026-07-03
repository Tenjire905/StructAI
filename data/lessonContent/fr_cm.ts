export const lessonFrCm = {
  "cm-1.s0.body":
    "La fenêtre de contexte est la mémoire de travail du modèle : le prompt, les exemples, les documents et l'historique du chat se partagent le même espace. Placez l'essentiel en premier et supprimez les redondances. Des entrées très longues peuvent évincer des instructions plus anciennes.",
  "cm-1.s0.title": "Tout prend de la place dans la fenêtre",
  "cm-1.s1.explanation":
    "Avec une fenêtre limitée, tous les éléments sont en concurrence - la priorisation et la brièveté comptent.",
  "cm-1.s1.opt0": "Le modèle devient automatiquement plus rapide.",
  "cm-1.s1.opt1":
    "Des instructions ou des détails plus anciens peuvent perdre de l'importance.",
  "cm-1.s1.opt2": "La fenêtre de contexte grandit sans limite.",
  "cm-1.s1.question":
    "Qu'est-ce qui a le plus de chances d'arriver avec un contexte très long ?",
  "cm-1.s2.explanation":
    "Des résumés distillés apportent du signal sans volume de tokens inutile.",
  "cm-1.s2.opt0": "Répéter la même règle cinq fois.",
  "cm-1.s2.opt1":
    "Utiliser un résumé compact au lieu des données brutes complètes.",
  "cm-1.s2.opt2": "Insérer toutes les pièces jointes sans filtrage.",
  "cm-1.s2.question":
    "Quelle stratégie préserve la fenêtre de contexte ?",
  "cm-1.title": "Comprendre la fenêtre de contexte",
  "cm-2.s0.body":
    "Une instruction système ou de rôle (\"Vous êtes un rédacteur expérimenté...\") calibre le ton, la profondeur et la gestion du risque. Les rôles doivent correspondre à la tâche et être précis - pas seulement \"expert\" sans domaine.",
  "cm-2.s0.title": "Un rôle fixe les attentes",
  "cm-2.s1.explanation":
    "Le domaine, le type de sortie et le public cible rendent le rôle pilotable.",
  "cm-2.s1.opt0": "Vous êtes très intelligent.",
  "cm-2.s1.opt1":
    "Vous êtes rédacteur technique pour des outils DevOps ; public cible : développeurs juniors.",
  "cm-2.s1.opt2": "Comportez-vous de manière professionnelle.",
  "cm-2.s1.question": "Quelle instruction de rôle est la plus utile ?",
  "cm-2.s2.explanation":
    "Les rôles orientent le style et le niveau de détail - ils ne remplacent pas la vérification des faits.",
  "cm-2.s2.opt0":
    "Pour garder un ton et une profondeur technique cohérents.",
  "cm-2.s2.opt1":
    "Pour inventer des faits mathématiques que vous ne vérifiez pas.",
  "cm-2.s2.opt2": "Pour cadrer le format de réponse et la perspective.",
  "cm-2.s2.question": "À quoi les rôles ne servent-ils pas ?",
  "cm-2.title": "Attribuer des rôles",
  "cm-3.s0.body":
    "Intégrez les connaissances de fond sous forme de bloc compact : faits produit, public cible et contraintes du projet. Indiquez ce qui est fixé (\"Donné :\") par opposition à ce qui peut être recherché. Trop de contexte non pertinent dilue la tâche.",
  "cm-3.s0.title": "N'inclure que les informations pertinentes",
  "cm-3.s1.explanation":
    "Des blocs \"Donné\" séparés rendent les faits faciles à repérer pour le modèle.",
  "cm-3.s1.opt0":
    "Les disperser sans structure entre la tâche et la formule de salutation.",
  "cm-3.s1.opt1":
    "Une section \"Donné :\" avec des puces, puis \"Tâche :\".",
  "cm-3.s1.opt2": "Les mentionner seulement de façon implicite et espérer.",
  "cm-3.s1.question":
    "Quelle est la manière la plus propre d'intégrer les connaissances du projet ?",
  "cm-3.s2.explanation":
    "Présenter des spéculations non vérifiées comme des éléments \"donnés\" crée des hallucinations avec un vernis d'autorité.",
  "cm-3.s2.opt0": "Des faits produit confirmés pour le texte.",
  "cm-3.s2.opt1":
    "Des spéculations que vous n'avez pas encore vérifiées vous-même, présentées comme des faits.",
  "cm-3.s2.opt2": "Le public cible et les consignes de ton.",
  "cm-3.s2.question":
    "Qu'est-ce qui ne fait PAS partie du contexte obligatoire ?",
  "cm-3.title": "Intégrer les connaissances de fond",
  "cm-4.s0.body":
    "Définissez le style par des caractéristiques concrètes : longueur des phrases, tutoiement ou vouvoiement, niveau technique et rhétorique autorisée. Une mini-phrase d'exemple dans le ton visé est souvent plus efficace que \"écris de manière décontractée\". Ne contredisez pas le ton par des exemples dans un autre style.",
  "cm-4.s0.title": "Le ton, c'est plus que \"sympathique\"",
  "cm-4.s1.explanation":
    "Les caractéristiques de style mesurables sont reproductibles - les adjectifs vagues ne le sont pas.",
  "cm-4.s1.instruction":
    "Remettez les étapes pour des consignes de style précises dans un ordre logique.",
  "cm-4.s1.item0":
    "Fixer des critères mesurables (longueur des phrases, forme d'adresse, niveau technique)",
  "cm-4.s1.item1": "Remplacer les adjectifs vagues par des règles concrètes",
  "cm-4.s1.item2": "Ajouter une mini-phrase d'exemple dans le ton visé",
  "cm-4.s1.item3": "Retirer les exemples contradictoires dans un autre style",
  "cm-4.s1.opt0": "Merci de le formuler gentiment.",
  "cm-4.s1.opt1":
    "Vouvoiement, ton factuel, 20 mots max. par phrase, pas de métaphores.",
  "cm-4.s1.opt2": "Moderne et frais.",
  "cm-4.s1.question": "Quelle consigne de style est la plus précise ?",
  "cm-4.s2.explanation":
    "Les exemples sont des signaux puissants - ils doivent correspondre au style souhaité.",
  "cm-4.s2.opt0": "Le modèle ignore toujours les exemples.",
  "cm-4.s2.opt1":
    "L'exemple peut prendre le dessus sur le ton - adaptez ou retirez l'exemple.",
  "cm-4.s2.opt2": "Mettre plus de majuscules dans les règles aide.",
  "cm-4.s2.question":
    "Vous voulez un ton factuel, mais vous fournissez un exemple décontracté. Conséquence ?",
  "cm-4.title": "Piloter le ton et le style",
  "cm-5.s0.body":
    "Une persona combine rôle, public cible, tabous et schémas de réponse. Elle est utile pour des tâches récurrentes (support, coaching, relecture). Gardez les personas courtes et cohérentes - trop de traits diluent le profil.",
  "cm-5.s0.title": "Persona = rôle plus règles de comportement",
  "cm-5.s1.explanation":
    "Les personas regroupent rôle, limites et schémas de réponse typiques pour assurer la cohérence.",
  "cm-5.s1.opt0":
    "Les personas comprennent plusieurs règles de comportement et limites pour des scénarios répétables.",
  "cm-5.s1.opt1": "Les personas ne fonctionnent que dans ChatGPT.",
  "cm-5.s1.opt2": "Il n'y a aucune différence.",
  "cm-5.s1.question":
    "Qu'est-ce qui distingue une persona d'un rôle en une ligne ?",
  "cm-5.s2.explanation":
    "Le domaine, l'axe, le tabou et le format de sortie rendent la persona opérationnelle.",
  "cm-5.s2.opt0": "Vous êtes gentil et serviable.",
  "cm-5.s2.opt1":
    "Développeur senior, axe : lisibilité et tests, pas de réécriture sans justification, retour en puces.",
  "cm-5.s2.opt2": "Vous aimez le code propre.",
  "cm-5.s2.question":
    "Quelle persona est la plus claire pour une revue de code ?",
  "cm-5.title": "Techniques de persona",
  "cm-6.s0.body":
    "La surcharge de contexte provient des pièces jointes non pertinentes, des informations en double et des sources contradictoires. Filtrez avant le prompt : que doit savoir le modèle pour résoudre la tâche ? Tout le reste n'est que du bruit.",
  "cm-6.s0.title": "Plus de contexte ≠ meilleure réponse",
  "cm-6.s1.explanation":
    "La curation et une liste explicite de faits apportent du signal sans bruit.",
  "cm-6.s1.opt0":
    "Joindre tous les e-mails de l'année \"au cas où\".",
  "cm-6.s1.opt1":
    "Des extraits sélectionnés plus une liste explicite des faits faisant autorité.",
  "cm-6.s1.opt2": "Dupliquer le prompt pour que rien ne se perde.",
  "cm-6.s1.question":
    "Quelle approche réduit la surcharge de contexte ?",
  "cm-6.s2.explanation":
    "Un contexte contradictoire non résolu produit des réponses aléatoires.",
  "cm-6.s2.opt0": "Insérer les deux sans commentaire.",
  "cm-6.s2.opt1":
    "Indiquer la priorité ou marquer une source comme faisant autorité.",
  "cm-6.s2.opt2": "Le modèle doit simplement deviner.",
  "cm-6.s2.question":
    "Deux sources se contredisent. Que faut-il faire ?",
  "cm-6.title": "Éviter la surcharge de contexte",
  "cm-7.s0.body":
    "Combinez un contexte obligatoire compact, un rôle ou une persona adaptée, des consignes de style claires et évitez la surcharge. Le prompt doit rester lisible : chaque paragraphe a une fonction.",
  "cm-7.s0.title": "Doser le contexte avec maîtrise",
  "cm-7.s1.explanation":
    "Contexte distillé, rôle et tâche claire - sans inonder la fenêtre.",
  "cm-7.s1.opt0":
    "Voici un PDF de 40 pages ; résumez quelque chose.",
  "cm-7.s1.opt1":
    "Rôle + 5 puces \"Donné\" + tâche + style + longueur max., PDF uniquement sous forme de résumé de 10 lignes.",
  "cm-7.s1.opt2": "Résumez ; vous savez ce qui est important.",
  "cm-7.s1.question":
    "Quel prompt démontre une maîtrise du contexte ?",
  "cm-7.s2.explanation":
    "La pertinence et l'absence de contradiction sont les critères de qualité des prompts de contexte.",
  "cm-7.s2.opt0":
    "Chaque bloc de contexte est-il pertinent et cohérent ?",
  "cm-7.s2.opt1":
    "Le prompt fait-il au moins deux fois la longueur de la tâche ?",
  "cm-7.s2.opt2":
    "Au moins trois rôles sont-ils définis en même temps ?",
  "cm-7.s2.question": "Dernière vérification avant l'envoi ?",
  "cm-7.title": "Projet final",
} as const;
