export const lessonFrCm: Record<string, string> = {
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
  "cm-10.s0.body": "Quand tu joins des documents, notes ou extraits de chat, exige explicitement : répondre uniquement à partir du contexte fourni. Si une information manque, le modèle doit le dire au lieu de deviner. C'est l'ancrage (grounding), indispensable pour le travail factuel.",
  "cm-10.s0.title": "Ancrage contre les hallucinations",
  "cm-10.s1.explanation": "D'abord le contexte, puis les règles, puis la tâche : le modèle sait où chercher et où s'arrêter.",
  "cm-10.s1.instruction": "Mets les étapes d'un prompt ancré dans un ordre logique.",
  "cm-10.s1.item0": "Insérer le contexte fourni dans une section dédiée",
  "cm-10.s1.item1": "Ajouter une règle explicite : répondre uniquement à partir de ce contexte",
  "cm-10.s1.item2": "Indiquer quoi dire si l'info manque : « Absent du contexte »",
  "cm-10.s1.item3": "Formuler la tâche concrète",
  "cm-10.s2.explanation": "Une règle de sortie explicite pour les faits manquants vaut mieux qu'un vague « sois prudent ».",
  "cm-10.s2.opt0": "Sois créatif et complète les faits manquants de façon plausible.",
  "cm-10.s2.opt1": "Utilise tes connaissances générales si le contexte est incomplet.",
  "cm-10.s2.opt2": "Si la réponse n'est pas dans le contexte, réponds « Absent du contexte fourni ».",
  "cm-10.s2.question": "Quelle consigne empêche le plus fiablement les hallucinations ?",
  "cm-10.title": "N'utiliser que le contexte fourni",
  "cm-11.s0.body": "Dans les longs prompts, le début (primauté) et la fin (récence) pèsent plus que le milieu. Place les règles critiques et la tâche stratégiquement : l'essentiel d'abord, la contrainte centrale répétée à la fin. Le milieu sert aux détails et aux exemples.",
  "cm-11.s0.title": "Le début et la fin comptent davantage",
  "cm-11.s1.explanation": "Les effets de primauté et de récence sont réels ; les exigences critiques vont en bordure, pas au cœur du texte.",
  "cm-11.s1.statement": "Une contrainte centrale mentionnée une seule fois au milieu d'un long document a plus de chances d'être oubliée que la même règle au début et à la fin.",
  "cm-11.s2.explanation": "Un double placement aux extrémités augmente les chances que la contrainte guide vraiment la réponse.",
  "cm-11.s2.opt0": "Une fois cachée au paragraphe 14.",
  "cm-11.s2.opt1": "Au début comme règle obligatoire, puis encore juste avant la tâche.",
  "cm-11.s2.opt2": "Uniquement dans le message système d'un chat précédent.",
  "cm-11.s2.question": "Tu as un contexte de 2 000 mots et une contrainte de longueur stricte. Où la placer ?",
  "cm-11.title": "Exploiter l'ordre du contexte",
  "cm-12.s0.body": "Tu connais maintenant la fenêtre de contexte, les rôles, le savoir de fond, le style, les personas, l'évitement de surcharge, la séparation système/utilisateur, le few-shot, l'ancrage et l'ordre. Tu combines ces blocs selon la tâche ; chaque prompt n'a pas besoin de tout.",
  "cm-12.s0.title": "Ce que tu as appris jusqu'ici",
  "cm-12.s1.explanation": "Combinaison de séparation, contexte curaté, exemples, ancrage et ordre stratégique.",
  "cm-12.s1.opt0": "Résume le PDF, tu connais le contexte.",
  "cm-12.s1.opt1": "Système : rôle + format. Utilisateur : bloc « Donné », 2 few-shots, règle d'ancrage, tâche, contrainte de longueur en fin.",
  "cm-12.s1.opt2": "Voici 50 pages de matière brute sans structure ; débrouille-toi.",
  "cm-12.s1.question": "Quel prompt montre la meilleure maîtrise du contexte d'après les leçons vues ?",
  "cm-12.s2.explanation": "Du cadre aux faits et modèles, puis à la tâche : le prompt reste lisible et pilotable.",
  "cm-12.s2.instruction": "Classe les blocs d'un bon prompt contextuel du plus général au plus concret.",
  "cm-12.s2.item0": "Rôle et format de sortie (système)",
  "cm-12.s2.item1": "Contexte « Donné » curaté",
  "cm-12.s2.item2": "Exemples few-shot (si nécessaire)",
  "cm-12.s2.item3": "Tâche concrète avec contrainte centrale répétée",
  "cm-12.title": "Premier bilan",
  "cm-8.s0.body": "Le prompt système fixe des règles durables : rôle, ton, limites de sécurité, format de sortie. Le message utilisateur contient la tâche concrète, les données et les exemples de cette exécution. Ne les mélange pas, sinon tu perds en clarté et en réutilisabilité.",
  "cm-8.s0.title": "Deux niveaux, deux fonctions",
  "cm-8.s1.explanation": "Le prompt système cadre un comportement récurrent ; la tâche actuelle et les données brutes vont dans le message utilisateur.",
  "cm-8.s1.opt0": "La question précise avec tous les chiffres de ce tableur.",
  "cm-8.s1.opt1": "Rôle, format de sortie et règles de comportement valables pour chaque requête.",
  "cm-8.s1.opt2": "Uniquement la formule de salutation de l'utilisateur.",
  "cm-8.s1.question": "Qu'est-ce qui appartient typiquement au prompt système ?",
  "cm-8.s2.explanation": "Les prompts système ne sont pas ignorés ; ils constituent souvent la couche la plus stable. Sépare selon la réutilisabilité, pas selon l'importance.",
  "cm-8.s2.statement": "Tout le contexte doit aller dans le message utilisateur, car les prompts système sont ignorés par les modèles.",
  "cm-8.title": "Prompt système vs. message utilisateur",
  "cm-9.s0.body": "Le few-shot consiste à montrer des paires entrée→sortie avant la tâche réelle. Un à trois exemples précis couvrant la structure et les cas limites valent mieux que dix modèles aléatoires. Les exemples doivent correspondre au format cible ; des exemples contradictoires créent de la confusion.",
  "cm-9.s0.title": "Quelques bons exemples valent mieux qu'une longue liste faible",
  "cm-9.s1.explanation": "La qualité et la structure enseignent le motif ; la quantité sans étiquettes correctes ajoute du bruit.",
  "cm-9.s1.opt0": "Trois textes de tickets courts avec les bons libellés et un cas limite.",
  "cm-9.s1.opt1": "Dix e-mails au hasard sans étiquettes pour que le modèle « apprenne seul ».",
  "cm-9.s1.opt2": "Un exemple avec un mauvais libellé pour tester le modèle.",
  "cm-9.s1.question": "Tu classes des tickets support en Urgent/Normal/Faible. Quel jeu d'exemples est le plus utile ?",
  "cm-9.s2.explanation": "Les exemples modélisent le format attendu ; le style d'écriture et la config API ne sont pas du contenu few-shot.",
  "cm-9.s2.opt0": "structure de sortie",
  "cm-9.s2.opt1": "écriture manuscrite de l'auteur",
  "cm-9.s2.opt2": "configuration de l'API",
  "cm-9.s2.prefix": "De bons exemples few-shot montrent la même",
  "cm-9.s2.suffix": "et au moins un cas limite.",
  "cm-9.title": "Utiliser des exemples few-shot",
};
