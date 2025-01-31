const roomSizes = {
    "Cramped":4,
    "Roomy":16,
    "Vast":36
}
const premadeRooms = {
    "Unassigned" : {
        description:`This room has not been assigned a room type.`
    },
    "Arcane Study" : {
        prerequisite: "Ability to use an Arcane Focus or tool as a Spellcasting Focus",
        space: "Roomy",
        hirelings: 1,
        order:"Craft", level:5,
        description:`An Arcane Study is a place of quiet research that contains one or more desks and bookshelves.
        <b><em>Arcane Study Charm.</em></b> After spending a Long Rest in your Bastion, you gain a magical Charm (see “Supernatural Gifts” in chapter 3) that lasts for 7 days or until you use it. The Charm allows you to cast Identify without expending a spell slot or using Material components. You can't gain this Charm again while you still have it.
        <b><em>Craft Options.</em></b> When you issue the Craft order to this facility, choose one of the following options:
        <br>
        <qs><b>Craft: Arcane Focus.</b> You commission the facility's hireling to craft an Arcane Focus. The work takes 7 days and costs no money. The Arcane Focus remains in your Bastion until you claim it.</qs>
        <qs><b>Craft: Book.</b> You commission the facility's hireling to craft a blank book. The work takes 7 days and costs you 10 GP. The book remains in your Bastion until you claim it.</qs>
        <qs><b>Craft: Magic Item (Arcana).</b> If you are level 9+, you can commission the facility's hireling to craft a Common or an Uncommon magic item chosen by you from the Arcana tables in chapter 7. The facility has the tool required to craft the item, and the hireling has proficiency with that tool as well as proficiency in the Arcana skill. See the “Crafting Magic Items” section in chapter 7 for the time and money that must be spent to craft the item, If the item allows its user to cast any spells from it, you must craft the item yourself (the facility’s hireling can assist), and you must have all those spells prepared every day you spend crafting the item.</qs>`
    },
    "Archive" : {
        prerequisite: "None",
        space: "Roomy",
        hirelings: 1,
        order:"Research", level:13,
        description:`An Archive is a repository of books, maps, and scrolls. It is usually attached to a Library behind a locked or secret door.
        <b><em>Research: Helpful Lore.</em></b> When you issue the Research order to this facility, you commission the facility's hireling to search the Archive for lore. The work takes 7 days. The hireling gains knowledge as if they had cast the Legend Lore spell, then shares this knowledge with you the next time you speak with them.
        <b><em>Reference Book.</em></b> Your Archive contains one copy of a reference book, which gives you a benefit you and the book are in your Bastion. You may choose one of the following options.
        <br>
        <qs><em>Bigby’s Handy Arcana Codex.</em> You have Advantage on any Intelligence (Arcana) check you make when you take the Study action to recall lore about spells, magic items, eldritch symbols, magical traditions, and planes of existence.</qs>
        <qs><em>The Chronepsis Chronicles.</em> You have Advantage on any Intelligence (History) check you make when you take the Study action to recall lore about historical events, legendary people, ancient kingdoms, past disputes, wars, and lost civilizations.</qs>
        <qs><em>Investigations of the Inquisitive.</em> You have Advantage on any Intelligence (Investigation) check you make when you take the Study action to make deductions based on clues or evidence or to recall lore about traps, ciphers, riddles, and gadgetry.</qs>
        <qs><em>Material Musings on the Nature of the World.</em> You have Advantage on any Intelligence (Nature) check you make when you take the Study action to recall lore about terrain, plants, animals, and the weather.</qs>
        <qs><em>The Old Faith and Other Religions.</em> You have Advantage on any Intelligence (Religion) check you make when you take the Study action to recall lore about deities, rites and prayers, hierarchies, holy symbols, and the practices of secret cults.</qs>
        <br>
        <b><em>Enlarging the Facility.</em></b> You can enlarge your Archive to a Vast facility by spending 2,000 GP. If you do so, you gain two additional reference books chosen from the list above.`
    },
    "Armory" : {
        prerequisite: "None",
        space: "Roomy",
        hirelings: 1,
        order:"Trade", level:5,
        description:`An Armory contains mannequins for displaying armor, hooks for holding Shields, racks for storing weapons, and chests for holding ammunition.
        <b><em>Trade: Stock Armory.</em></b> When you issue the Trade order to this facility, you commission the facility's hireling to stock the Armory with armor, Shields, weapons, and ammunition. This equipment costs you 100 GP plus an extra 100 GP for each Bastion Defender in your Bastion. If your Bastion has a Smithy, the total cost is halved.
        <b><em></em></b>While your Armory is stocked, your Bastion Defenders are harder to kill. When any event causes you to roll dice to determine if your Bastion loses one or more of its defenders (see “Bastion Events” at the end of this chapter), roll 1d8 in place of each d6 you would normally roll. When the event is over, the equipment in your Armory is expended regardless of how many Bastion Defenders you have or how many you lost, leaving your Armory depleted until you issue another Trade order to the facility and pay the cost to restock it.`
    },
    "Barrack" : {
        prerequisite: "None",
        space: "Roomy",
        hirelings: 1,
        order:"Recruit", level:5,
        description:`A Bastion can have more than one Barrack, each of which is furnished to serve as sleeping quarters for up to twelve Bastion Defenders,
        <b><em>Recruit: Bastion Defenders.</em></b> Each time you issue the Recruit order to this facility, up to four Bastion Defenders are recruited to your Bastion and assigned quarters in this Barrack. The recruitment costs no money. You can't issue the Recruit order to this facility if it’s fully occupied.
        <b><em></em></b>Keep track of the Bastion Defenders housed in each of your Barracks. If you lose Bastion Defenders, deduct them from your roster. Assign names and personalities to your Bastion Defenders as you see fit.
        <b><em>Enlarging the Facility.</em></b> You can enlarge your Barrack to a Vast facility by spending 2,000 GP. A Vast Barrack can accommodate up to twenty-five Bastion Defenders.`
    },
    "Demiplane" : {
        prerequisite: "Ability to use an Arcane Focus or a tool as a Spellcasting Focus",
        space: "Vast",
        hirelings: 1,
        order:"Empower", level:17,
        description:`A door up to 5 feet wide and 10 feet tall appears on a flat, solid surface in one of the other facilities in your Bastion. You choose the location. If you are in your Bastion during a Bastion turn, you ean relocate this door to another facility in your Bastion.
        <b><em></em></b>Only you and your Bastion’s hirelings can open the door, which leads to a Demiplane that takes the form of a stone room. The Demiplane exists in an extradimensional space and therefore isn't attached physically to other locations in your Bastion. neither the Demiplane nor its door can be dispelled.
        <b><em>Empower: Arcane Resilience.</em></b> When you issue the Empower order to this facility, magical runes appear on the Demiplane's walls and last for 7 days. Until the runes disappear, you gain Temporary Hit Points equal to five times your level after spending an entire Long Rest in the Demiplane.
        <b><em>Fabrication.</em></b> While in the Demiplane, you can take a Magic action to create a nonmagical object of your choice from nothing, causing it to appear in an unoccupied space in the Demiplane. The object can be no bigger than 5 feet in any dimension; can't have a value over 5 GP; and must be made of wood, stone, clay, porcelain, glass, paper, nonprecious crystal, or nonprecious metal. You must finish a Long Rest before you can take this action again.`
    },
    "Gambling Hall" : {
        prerequisite: "None",
        space: "Vast",
        hirelings: 4,
        order:"Trade", level:9,
        description:`A Gaming Hall offers recreational activities like chess and games of darts, cards, or dice.
        <b><em>Trade: Gambling Hall.</em></b> When you issue the Trade order to this facility, the facility's hirelings turn the Gaming Hall into a gambling den for 7 days. At the end of the seventh day, roll 1d100 and consult the following table to determine your portion of the house's winnings.
        <table><tr><th>1d100</th><th>Winnings</th><th>1d100</th><th>Winnings</th></tr><tr><td>1-50</td><td>1d6 x 10 GP</td><td>86-95</td><td>4d6 x 10 GP</td></tr><tr><td>51-85</td><td>2d6 x 10 GP</td><td>99-00</td><td>10d6 x 10 GP</td></tr></table>
        `
    },
    "Garden" : {
        prerequisite: "None",
        space: "Roomy",
        hirelings: 1,
        order:"Harvest", level:5,
        description:`A Bastion can have more than one Garden. Each time you add a Garden to your Bastion, choose its type from the options in the Garden Types table.
        <b><em></em></b>While in your Bastion, you can instruct the facility’s hireling to change the Garden from one type to another. This work takes 21 days, during which time no other activity can occur in this facility.
        <b><em>Harvest: Garden Growth.</em></b> When you issue the Harvest order to this facility, you commission the facility’s hireling to collect items from the Garden as noted in the Garden Types table. The work takes 7 days and costs no money.
        <b><em>Enlarging the Facility.</em></b> You can enlarge your Garden to a Vast facility by spending 2,000 GP. A Vast Garden is equivalent to two Roomy Gardens and can include two of the same type of Garden or two different types. When you issue the Harvest order to a Vast Garden, each component garden produces its own harvest. A Vast Garden gains one additional hireling.
        <table><tr><th>Garden Type</th><th>Description</th><th>Harvest</th></tr><tr><td>Decorative</td><td>Aesthetically pleasing garden full of flowers and topiaries</td><td>Ten exquisite floral bouquets (worth 5 GP each), ten vials of Perfume, or ten Candles</td></tr><tr><td>Food</td><td>Garden of delicious mushrooms or vegetables</td><td>100 days worth of Rations</td></tr><tr><td>Herb</td><td>Garden of rare herbs, some of which have medicinal uses</td><td>Herbs that are used to create either ten Healer's Kits or one Potion of Healing</td></tr><tr><td>Poison</td><td>Garden stocked with plants and fungi from which poisons and antitoxin can be extracted</td><td>Plants that are used to create either two vials of Antitoxin or one vial of Basic Poison</td></tr></table>
        `
    },
    "Greenhouse" : {
        prerequisite: "None",
        space: "Roomy",
        hirelings: 1,
        order:"Harvest", level:9,
        description:`A Greenhouse is an enclosure where rare plants and fungi are nurtured in a controlled climate.
        <b><em>Fruit of Restoration.</em></b> One plant in your Greenhouse has three magical fruits growing on it. Any creature that eats one of these fruits gains the benefit ofa Lesser Restoration spell. Fruits that aren't eaten within 24 hours of being picked lose their magic. The plant replaces all picked fruits daily at dawn, and it can't be transplanted without killing it.
        <b><em>Harvest Options.</em></b> When you issue the Harvest order to this facility, choose one of the following options:
        <br>
        <qs><b>Harvest: Healing Herbs.</b> You commission the facility's hireling to create a Potion of Healing (greater) made from healing herbs. The work takes 7 days and costs no money. </qs>
        <qs><b>Harvest: Poison.</b> You commission the facility's hireling to extract one application of a poison from rare plants or fungi. Choose the type of poison from the following options: Assassin’s Blood, Malice, Pale Tincture, or Truth Serum. See “Poison” in chapter 3 for each poison’s effect. Once harvested, the poison can be contained in a vial. The work takes 7 days and costs no monney.</qs>`
    },
    "Guildhall" : {
        prerequisite: "Expertise in a skill",
        space: "Vast",
        hirelings: 1,
        order:"Recruit", level:17,
        description:`A Guildhall comes with a guild, for which you are the guild master. Choose the type of guild from the options in the Sample Guilds table, or work with your DM to create a new guild. The facility is a meeting room where members of your guild can discuss important matters in your presence.
        <b><em></em></b>Your guild has roughly fifty members made up of skilled folk who live and work outside your Bastion, usually in nearby settlements.
        <b><em>Recruit: Guild Assignment.</em></b> Each time you issue the Recruit order to this facility, you commission the facility's hireling to recruit guild members to perform a special assignment. Each guild in the Sample Guilds table specifies the nature of that assignment. With your DM's permission and help, you can create new assignments for guild members to complete.`
    },
    "Laboratory" : {
        prerequisite: "None",
        space: "Roomy",
        hirelings: 1,
        order:"Craft", level:9,
        description:`A Laboratory contains storage space for alchemical supplies and workspaces for crafting various concoctions.
        <b><em>Craft Options.</em></b> When you issue the Craft order to this facility, choose one of the following options:
        <br>
        <qs><b>Craft: Alchemist’s Supplies.</b> The facility's hireling crafts anything that can be made with Alchemist’s Supplies, using the rules in the Player's Handbook and chapter 7 of this book.</qs>
        <qs><b>Craft: Poison.</b> You commission the facility's hireling to craft a vial containing one application of a poison. The poison must be one of the following: Burnt Othur Fumes, Essence of Ether, or Torpor. This work takes 7 days, and you must pay half the poison’s cost. See “Poison” in chapter 3 for descriptions and costs of poisons.</qs>`
    },
    "Library" : {
        prerequisite: "None",
        space: "Roomy",
        hirelings: 1,
        order:"Research", level:5,
        description:`This Library contains a collection of books plus one or more desks and reading chairs.
        <b><em>Research: Topical Lore.</em></b> When you issue the Research order to this facility, you commission the facility’s hireling to research a topic. The topic can be a legend, a known event or location, a person of significance, a type of creature, or a famous object. The work takes 7 days. When the research concludes, the hireling obtains up to three accurate pieces of information about the topic that were previously unknown to you and shares this knowledge with you the next time you speak with them. The DM determines what information you learn,`
    },
    "Meditation Chamber" : {
        prerequisite: "None",
        space: "Cramped",
        hirelings: 1,
        order:"Empower", level:13,
        description:`A Meditation Chamber is a relaxing space that helps align one’s mind, body, and spirit.
        <b><em>Empower: Inner Peace.</em></b> When you issue the Empower order to this facility, your Bastion's hirelings can use the Meditation Chamber to gain a measure of inner peace. The next time you roll for a Bastion event, you can roll twice and choose either result.
        <b><em>Fortify Self.</em></b> You can meditate in this facility over a period of 7 days. If you leave the Bastion during this time, you gain no benefit. Otherwise, at the end of the seventh day, you gain Advantage on two kinds of saving throws for the next 7 days, deterined randomly by rolling a d6. Reroll if you get a duplicate result.`
    },
    "Menagerie" : {
        prerequisite: "None",
        space: "Vast",
        hirelings: 2,
        order:"Recruit", level:13,
        description:`A Menagerie has enclosures big enough to contain up to four Large creatures. Four Small or Medium creatures can occupy the same space as one Large creature there.
        <b><em>Recruit: Creature.</em></b> When you issue the Recruit order to this facility, you commission the facility's hirelings to add a creature from the Menager Creatures table to your Menagerie. The recruitment takes 7 days and costs you the amount listed in the table. The hirelings look after the creature.
        <b><em></em></b>Creatures in your Menagerie count as Bastion Defenders. Deduct any you lose from your Bastion Defenders roster. You can choose not to count one or more of these creatures as Bastion Defenders, in which case they can't be called on to defend the Bastion. Instead, they act in accordance with their nature and use their stat blocks in the Monster Manual.
        <b><em></em></b>See the DM's Guide for creature options and costs.`
    },
    "Observatory" : {
        prerequisite: "Ability to use a Spellcasting Focus",
        space: "Roomy",
        hirelings: 1,
        order:"Empower", level:13,
        description:`Situated atop your Bastion, your Observatory contains a telescope aimed at the night sky.
        <b><em>Observatory Charm.</em></b> You can use your Observatory to peer into the far corners of Wildspace and the Astral Plane. After spending a Long Rest in your Observatory, you gain a magical Charm (see “Supernatural Gifts” in chapter 3) that lasts for 7 days or until you use it. The Charm allows you to cast Contact Other Plane without expending a spell slot. You can't gain this Charm again while you still have it.
        <b><em>Empower: Eldritch Discovery.</em></b> When you issue the Empower order to this facility, you enable yourself or the facility's hireling to explore the eldritch mysteries of the stars for 7 consecutive nights. At the end of that time, roll a die. If the number rolled is even, nothing is gained. If the number rolled is odd, an unknown power bestows one of the following Charms on you or another creature of your choice that is on the same plane of existence as you: Charm of Darkvision, Charm of Heroism, or Charm of Vitality (all described in chapter 3).`
    },
    "Pub" : {
        prerequisite: "None",
        space: "Roomy",
        hirelings: 1,
        order:"Research", level:13,
        description:`Folks come here to consume tasty beverages and socialize. Your Pub might be a bar, coffee shop, or tearoom, and it might have a colorful name, such as the Rusty Flagon or the Dragon's Loft. The facility's hireling, who serves as the bartender, maintains a network of spies scattered throughout nearby communities. These spies are useful sources of information and frequent the Pub, often incognito.
        <b><em>Research: Information Gathering.</em></b> When you issue the Research order to this facility, you commission the Pub’s bartender to gather information from spies who are aware of important events happening within 10 miles of your Bastion over the next 7 days. During that time, these spies can divulge the location of any creature that is familiar to you, provided the creature is within 50 miles of your Bastion and not hidden by magic or confined to a location that the DM deems is beyond the spy network's ability to locate. If the spies learn the target's location, they also learn where that creature has been for the previous 7 days.
        <b><em>Pub Special.</em></b> The Pub has one magical beverage on tap, chosen from the options below:
        <br>
        <qs><b>Bigby's Burden.</b> Drinking a pint of this beverage grants you the “enlarge” effect of an Enlarge/Reduce spell that has a duration of 24 hours (no saving throw allowed).</qs>
        <qs><b>Kiss of the Spider Queen.</b> Drinking a pint of this beverage grants you the effect of a Spider Climb spell that has a duration of 24 hours.</qs>
        <qs><b>Moonlight Serenade.</b> Drinking a pint of this beverage gives you Darkvision out to 60 feet for 24 hours. If you already have Darkvision, its range is extended by 60 feet for the same duration.</qs>
        <qs><b>Positive Reinforcement.</b> Drinking a pint of this beverage gives you Resistance to Necrotic damage for 24 hours.</qs>
        <qs><b>Sterner Stuff.</b> For 24 hours after drinking a pint of this beverage, you automatically succeed on saving throws to avoid or end the Frightened condition.</qs>
        <br>
        At the start of a Bastion turn, you can switch to one of the other options. Your DM may create new options. A pint of this magical beverage loses its magic 24 hours after it's poured.
        <b><em>Enlarging the Facility.</em></b> You can enlarge your Pub to a Vast facility by spending 2,000 GP. If you do so, the Pub can have two magical beverages from the Pub Special list on tap at a time. A Vast Pub gains three additional hirelings, for a total of four. These new hirelings are servers. Assign names and personalities to them as you see fit.`
    },
    "Reliquary" : {
        prerequisite: "Ability to use a Holy Symbol or Druidic Focus as a Spelicasting Focus",
        space: "Cramped",
        hirelings: 1,
        order:"Harvest", level:13,
        description:`This vault holds sacred objects.
        <b><em>Reliquary Charm.</em></b> After spending a Long Rest in your Bastion, you gain a magical Charm (see “Supernatural Gifts” in chapter 3) that lasts for 7 days or until you use it. The Charm allows you to cast Greater Restoration once without expending a spell slot or using Material components. You can’t gain this Charm again while you still have it.
        <b><em>Harvest: Talisman.</em></b> When you issue the Harvest order to this facility, you commission its hireling to produce a specially prepared talisman for your use. The talisman usually takes the form of an amulet, a rune-carved box, or a statuette, but it can be any Tiny, nonmagical object that has religious significance. The work takes 7 days and costs no money. You can use this talisman in place of one spell’s Material components, provided the components have a cost of 1,000 GP or less. If the spell normally consumes its components, the talisman isn't consumed. After the talisman has been used in this way, it can’t be used again until you return it to your Reliquary and use another Harvest order to prepare it.`
    },
    "Sacristy" : {
        prerequisite: "None",
        space: "Roomy",
        hirelings: 1,
        order:"Craft", level:9,
        description:`A Sacristy serves as a preparation and storage room for the sacred items and religious vestments.
        <b><em>Craft Options.</em></b> When you issue the Craft order to this facility, choose one of the following options:
        <br>
        <qs><b>Craft: Holy Water.</b> You commission the facility's hireling to craft a flask of Holy Water. The work takes 7 days and costs no money. You can spend GP during the creation process to increase the potency of the Holy Water. For every 100 GP you spend, up to a maximum of 500 GP, the damage dealt by the Holy Water increases by 1d8.</qs>
        <qs><b>Craft: Magic Item (Relic).</b> You commission the facility’s hireling to craft a Common or an Uncommon magic item chosen by you from the Relics tables in chapter 7. The facility has the tool required to craft the item, and the hireling has proficiency with that tool as well as proficiency in the Arcana skill. See the “Crafting Magic Items” section in chapter 7 for the time and money that must be spent to craft the item. If the item allows its user to cast any spells from it, you must craft the item yourself (the facility's hireling can assist), and you must have all those spells prepared every day you spend crafting the item.</qs>
        <br>
        <b><em>Spell Refreshment.</em></b> Having a Sacristy allows you to regain one expended spell slot of level 5 or lower after spending an entire Short Rest in your Bastion. You can't gain this benefit again until you finish a Long Rest.
        `
    },
    "Sanctuary" : {
        prerequisite: "Ability to use a Holy Symbol or Druidic Focus as a Spellcasting Focus",
        space: "Roomy",
        hirelings: 1,
        order:"Craft", level:5,
        description:`Icons of your religion are displayed in this facility, which includes a quiet place for worship.
       <b><em>Sanctuary Charm.</em></b> After spending a Long Rest in your Bastion, you gain a magical Charm (see “Supernatural Gifts” in chapter 3) that lasts for 7 days or until you use it. The Charm allows you to cast Healing Word once without expending a spell slot. You can’t gain this Charm again while you still have it.
       <b><em>Craft: Sacred Focus.</em></b> When you issue the Craft order to this facility, you commission the facility's hireling to craft a Druidic Focus (wooden staff) or a Holy Symbol. The work takes 7 days and costs no money. The item remains in your Bastion until you claim it.`
    },
    "Sanctum" : {
        prerequisite: "Ability to use a Holy Symbol or Druidic Focus as a Spellcasting Focus",
        space: "Roomy",
        hirelings: 1,
        order:"Empower", level:17,
        description:`A Sanctum is a place of solace and healing.
        <b><em>Sanctum Charm.</em></b> After spending a Long Rest in your Bastion, you gain a magical Charm (see “Supernatural Gifts” in chapter 3) that lasts for 7 days or until you use it. The Charm allows you to cast Heal once without expending a spell slot. You can't gain this Charm again while you still have it.
        <b><em>Empower: Fortifying Rites.</em></b> When you issue the Empower order to this facility, you inspire its hirelings to perform daily rites that benefit you or another character you name. The beneficiary doesn’t need to be in the Bastion when the rites are performed to gain their benefit. Each time the beneficiary finishes a Long Rest, they gain Temporary Hit Points equal to your level. This effect lasts for 7 days.
        <b><em>Sanctum Recall.</em></b> While the Sanctum exists, you always have the Word of Recall spell prepared. Whenever you cast Word of Recall, you can make your Sanctum the destination of the spell instead of another place you have previously designated. In addition, one creature of your choice that arrives in the Sanctum via this spell gains the benefit of a Heal spell.`
    },
    "Scriptorium" : {
        prerequisite: "None",
        space: "Roomy",
        hirelings: 1,
        order:"Craft", level:9,
        description:`A Scriptorium contains desks and writing supplies.
        <b><em>Craft Options.</em></b> When you issue the Craft order to this facility, choose one of the following options:
        <br>
        <qs><b>Craft: Book Replica.</b> You commission the facility's hireling to make a copy of a nonmagical Book. Doing so requires a blank book. The work takes 7 days.</qs>
        <qs><b>Craft: Spell Scroll.</b> You commission the facility's hireling to scribe a Spell Scroll containing one Cleric or Wizard spell of level 3 or lower. The facility has the necessary Calligrapher’s Supplies, and the hireling meets all the prerequisites needed to scribe the scroll. The “Crafting Equipment” section in the Player's Handbook specifies the time needed to scribe the scroll and the cost of the scroll, which you must pay.</qs>
        <qs><b>Craft: Paperwork.</b> You commission the facility's hireling to create up to fifty copies of a broadsheet, a pamphlet, or another loose-leaf paper product. The work takes 7 days and costs you 1 GP per copy. At no additional cost in time or money, the facility's hireling can distribute the paperwork to one or more locations within 50 miles of your Bastion.</qs>`
    },
    "Smithy" : {
        prerequisite: "None",
        space: "Roomy",
        hirelings: 2,
        order:"Craft", level:5,
        description:`This Smithy contains a forge, an anvil, and other tools needed to craft weapons, armor, and other equipment.
        <b><em>Craft Options.</em></b> When you issue the Craft order to this facility, choose one of the following options:
        <br>
        <qs><b>Craft: Smith's Tools.</b> The facility's hirelings craft anything that can be made with Smith's Tools, using the rules in the Player's Handbook.</qs>
        <qs><b>Craft: Magic Item (Armament).</b> If you are level 9+, you can commission the facility's hirelings to craft a Common or an Uncommon magic item chosen by you from the Armaments tables in chapter 7. The facility has the tool required to craft the item, and the hirelings have proficiency with that tool as well as proficiency in the Arcana skill. See the “Crafting Magic Items” section in chapter 7 for the time and money that must be spent to craft the item. If the item allows its user to cast any spells from it, you must craft the item yourself (the facility's hirelings can assist), and you must have all those spells prepared every day you spend crafting the item.</qs>`
    },
    "Stable" : {
        prerequisite: "None",
        space: "Roomy",
        hirelings: 1,
        order:"Trade", level:9,
        description:`A Bastion can have more than one Stable. Each Stable you add to your Bastion comes with one Riding Horse or Camel and two Ponies or Mules; see the Player's Handbook or the Monster Manual for these creatures’ stat blocks. The facility is big enough to house three Large animals. Two Medium creatures occupy the same amount of space as one Large creature there. The facility's hireling looks after these creatures.
        <b><em></em></b>After a Beast that can serve as a mount spends at least 14 days in this facility, all Wisdom (Animal Handling) checks made with respect to it have Advantage.
        <b><em>Trade: Animals.</em></b> When you issue the Trade order to this facility, you commission the facility's hireling to buy or sell one or more mounts at normal cost, keeping the ones you buy in your Stable. The work takes 7 days, and the DM decides what types of animals are available for purchase — horses, ponies, and mules being the most common. The Mounts and Other Animals table in the Player's Handbook gives standard prices for various mounts. You bear the total cost of any purchases.
        <b><em></em></b>When you sell a mount from your Stable, the buyer pays you 20 percent more than the standard price; this profit increases to 50 percent when you reach level 13 and 100 percent when you reach level 17.
        <b><em>Enlarging the Facility.</em></b> You can enlarge your Stable to a Vast facility by spending 2,000 GP. If you do so, the Stable is large enough to house six Large animals.`
    },
    "Storehouse" : {
        prerequisite: "None",
        space: "Roomy",
        hirelings: 1,
        order:"Trade", level:5,
        description:`A Storehouse is a cool, dark space meant to contain objects from the Trade Goods table in chapter 7 and from chapter 6 of the Player’s Handbook.
        <b><em>Trade: Goods.</em></b> When you issue the Trade order to this facility, its hireling spends the next 7 days procuring nonmagical items that have a total value of 500 GP or less and stores them in the Storehouse, or the hireling uses those 7 days to sell goods in the Storehouse. You bear the total cost of any purchases, and the maximum value of the items purchased increases to 2,000 GP when you reach level 9 and 5,000 GP when you reach level 13.
        <b><em></em></b>When you sell goods from your Storehouse, the buyer pays you 10 percent more than the standard price; this profit increases to 20 percent when you reach level 9, 50 percent when you reach level 13, and 100 percent when you reach level 17.`
    },
    "Teleportation Circle" : {
        prerequisite: "None",
        space: "Roomy",
        hirelings: 1,
        order:"Recruit", level:9,
        description:`Inscribed on the floor of this room is a permanent teleportation circle created by the Teleportation Cir- cle spell.
        <b><em>Recruit: Spellcaster.</em></b> Each time you issue the Recruit order to this facility, its hireling extends an invitation to a Friendly NPC spelicaster. Roll any die. If the number rolled is odd, the invitee declines the invitation, and you gain no benefit from having issued the order. If the number rolled is even, the invitee accepts the invitation and arrives in your Bastion via your Teleportation Circle.
        <b><em></em></b>While you are in your Bastion, you can ask the spellcaster to cast one Wizard spell of level 4 or lower; if you are level 17+, the spell’s maximum level increases to 8. The spellcaster is assumed to have the spell prepared. If the spell has one or more Material components that cost money, you must pay for them before the spell can be cast.
        <b><em></em></b>The spellcaster stays for 14 days or until they cast a spell for you. The spelicaster won't defend your Bastion and departs immediately if the Bastion is attacked (see “Bastion Events" at the endofthe chapter).`
    },
    "Theater" : {
        prerequisite: "None",
        space: "Vast",
        hirelings: 4,
        order:"Empower", level:9,
        description:`The Theater contains a stage, a backstage area where props and sets are kept, and a seating area fora small audience.
        <b><em>Empower: Theatrical Event.</em></b> When you issue the Empower order to this facility, its hirelings begin work on a theatrical production or concert. Rehearsals and other preparations take 14 days, followed by at least 7 days of performances. The performances can continue indefinitely until a new production gets underway.
        <b><em></em></b>You or another character can contribute to a production in the following ways:
        <br>
        <qs><b>Composer/Writer.</b> A character can compose music or write a script for a concert or production that hasn't started rehearsals yet. This effort takes 14 days.</qs>
        <qs><b>Conductor/Director.</b> A character who remains in the Bastion for the entirety of the production can serve as the concert’s conductor or the production's director.</qs>
        <qs><b>Performer.</b> A character who remains in the Bastion for the entirety of the rehearsal period can be a star performer in one or more of the performances; one of the Theater's hirelings can serve as an understudy for additional performances.</qs>
        <br>
        At the end of a rehearsal period, each character who contributed to the concert or production can make a DC 15 Charisma (Performance) check. If more of these checks succeed than fail, you and any other character who contributed to the concert or production each gain a Theater die, a d6. This die changes to a d8 when you reach level 13 and a 10 when you reach level 17. At any point after the rehearsals end, a character can expend their Theater die to roll it and add the number rolled to one D20 Test they make, immediately after rolling the d20. If a character hasn't expended their Theater die before gaining another, their first die is lost.`
    },
    "Training Area" : {
        prerequisite: "None",
        space: "Vast",
        hirelings: 4,
        order:"Empower", level:9,
        description:`Bastion can have more than one Training Area. A Training Area might be an open courtyard, a gymnasium, a music or dance hall, or a cleverly built gauntlet of traps and hazards. It might contain inanimate targets (for weapon practice), padded mats, and other equipment. One of the facility's hirelings is an expert trainer; the others serve as training partners.
        <b><em></em></b>When a Training Area becomes part of your Bastion, choose one trainer from the Expert Trainers table. On each Bastion turn, you can replace that trainer with another one from the table.
        <br>
        <qs><em>Battle Expert. </em>When you take damage from an attack made with an Unarmed Strike or a weapon, you can take a Reaction to reduce this damage by 1d4.</qs>
        <qs><em>Skills Expert. </em>You gain proficiency in one of the following skills of your choice: Acrobatics, Athletics, Performance, Sleight of Hand, or Stealth.</qs>
        <qs><em>Tools Expert. </em>You gain proficiency with one tool of your choice.</qs>
        <qs><em>Unarmed Combat Expert. </em>When you hit with your Unarmed Strike and deal damage, the attack deals an extra 1d4 Bludgeoning damage.</qs>
        <qs><em>Weapon Expert. </em>Choose a kind of Simple or Martial weapon, such as Spear or Longbow. Ifyou aren't proficient with the weapon, you gain proficiency with it. If you already have proficiency with the weapon, you can use its mastery property.</qs>
        <br>
        <b><em>Empower: Training.</em></b> When you issue the Empower order to this facility, the facility’s hirelings conduct training exercises for the next 7 days. Any character who trains here for at least 8 hours on each of those days gains a benefit at the end of the training period. The benefit depends on which trainer is present in the facility, as noted in the Expert Trainers table. The benefit lasts for 7 days.`
    },
    "Trophy Room" : {
        prerequisite: "None",
        space: "Roomy",
        hirelings: 1,
        order:"Research", level:9,
        description:`This room houses a collection of mementos, such as weapons from old battles, the mounted heads of slain creatures, trinkets plucked from dungeons and ruins, and trophies passed down from ancestors.
        <b><em>Research Options.</em></b> When you issue the Research order to this facility, choose one of the following options:
        <br>
        <qs><b>Research: Lore.</b> You commission the facility's hireling to research a topic of your choice. The topic can be a legend, any kind of creature, or a famous object. The topic need not be directly related to items on display in the room, as the trophies provide clues to research a wide variety of other subjects. The work takes 7 days. When the research concludes, the hireling obtains up to three accurate pieces of information about the topic that were previously unknown to you and shares this knowledge with you the next time you speak with them. The DM determines what information is learned.</qs>
        <qs><b>Research: Trinket Trophy.</b> You commission the facility’s hireling to search for a trinket that might be of use to you. The work takes 7 days. When the research concludes, roll any die. If the number rolled is odd, the hireling finds nothing useful. If the number rolled is even, the hireling finds a magic item. Roll on the Implements—Common table in chapter 7 to determine what it is.</qs>`
    },
    "War Room" : {
        prerequisite: "Fighting Style feature or Unarmored Defense feature",
        space: "Vast",
        hirelings: 2,
        order:"Recruit", level:17,
        description:`The War Room is where you plan military actions in consultation with an inner circle of loyal lieutenants, each one a battle-hardened Veteran Warrior (see the Monster Manual) whose alignment matches yours. You start with two lieutenants but can add more, as described below. If your Bastion lacks facilities to house your lieutenants, they secure accommodations in the inn or settlement closest to your Bastion. Lieutenants are hirelings, not Bastion Defenders; however, if your Bastion is attacked (see “Bastion Events” at the end of this chapter), each lieutenant housed in your Bastion reduces by 1 the number of dice you roll to determine how many Bastion Defenders are lost in the attack.
        <b><em></em></b>The War Room contains war memorabilia plus a large table surrounded by enough chairs for you and your lieutenants.
        <b><em>Recruit Options.</em></b> When you issue the Recruit order to this facility, choose oneofthe following options:
        <br>
        <qs><b>Recruit: Lieutenant.</b> You gain one new lieutenant, You can have up to ten lieutenants at any time. Assign names and personalities to them as you see fit.</qs>
        <qs><b>Recruit: Soldiers.</b> You commission one or more of your lieutenants to assemble a small army. Each lieutenant can muster one hundred Guards (see the Monster Manual) in 7 days to fight for your cause. Reduce that number to twenty if you want them to be mounted on Riding Horses (see the Monster Manual). It costs you 1 GP per day to feed each guard and each horse in your army. Wherever the army goes, it must be led by you or at least one of your lieutenants, or else it disbands immediately. The army also disbands if it goes 1 day without being fed. Otherwise, the army remains until it is destroyed or you command it to disband. You can't issue this Recruit order again until your current army disbands or is destroyed.</qs>`
    },
    "Workshop" : {
        prerequisite: "None",
        space: "Roomy",
        hirelings: 3,
        order:"Craft", level:5,
        description:`This Workshop is a creative space where useful items can be crafted.
        <b><em>Artisan’s Tools.</em></b> The Workshop comes equipped with six different kinds of Artisan's Tools, chosen from the following list: Carpenter's Tools, Cobbler’s Tools, Glassblower’s Tools, Jeweler's Tools, Leatherworker’s Tools, Mason's Tools, Painter's Tools, Potter's Tools, Tinker's Tools, Weaver's Tools, and Woodcarver's Tools. Note that Smith's tools are not on this list.
        <b><em>Craft Options.</em></b> When you issue the Craft order to this facility, choose one of the following options:
        <br>
        <qs><b>Craft: Adventuring Gear.</b> The facility's hirelings craft anything that can be made with the tools you chose when you added the Workshop to your Bastion (see above), using the rules in the Player's Handbook.</qs>
        <qs><b>Craft: Magic Item (Implement).</b> If you are level 9, you can commission the facility's hirelings to craft a Common or an Uncommon magic item chosen by you from the Implements tables in chapter 7. The facility has the tool required to craft the item, and the hirelings have proficiency with that tool as well as proficiency in the Arcana skill. See the “Crafting Magic Items” section in chapter 7 for the time and money that must be spent to craft the item. If the item allows its user to cast any spells from it, you must craft the item yourself (the facility's hirelings can assist), and you must have all those spells prepared every day you spend crafting the item.</qs>
        <br>
        <b><em>Source of Inspiration.</em></b> After spending an entire Short Rest in your Workshop, you gain Heroic Inspiration. You can't gain this benefit again until you finish a Long Rest.
        <b><em>Enlarging the Facility.</em></b> You can enlarge your Workshop to a Vast facility by spending 2,000 GP. If you do so, the Workshop gains two additional hirelings and three additional Artisan's Tools (chosen from the list above).
        `
    },
    // "" : {
    //     prerequisite: "",
    //     space: "",
    //     hirelings: 0,
    //     order:"Craft", level:5,
    //     description:``
    // },
    // "" : {
    //     prerequisite: "",
    //     space: "",
    //     hirelings: 0,
    //     order:"Craft", level:5,
    //     description:``
    // },
    // "" : {
    //     prerequisite: "",
    //     space: "",
    //     hirelings: 0,
    //     order:"Craft", level:5,
    //     description:``
    // },
    // "" : {
    //     prerequisite: "",
    //     space: "",
    //     hirelings: 0,
    //     order:"Craft", level:5,
    //     description:``
    // },
    // "" : {
    //     prerequisite: "",
    //     space: "",
    //     hirelings: 0,
    //     order:"Craft", level:5,
    //     description:``
    // },
    // "" : {
    //     prerequisite: "",
    //     space: "",
    //     hirelings: 0,
    //     order:"Craft", level:5,
    //     description:``
    // },
    // "" : {
    //     prerequisite: "",
    //     space: "",
    //     hirelings: 0,
    //     order:"Craft", level:5,
    //     description:``
    // },
    // "" : {
    //     prerequisite: "",
    //     space: "",
    //     hirelings: 0,
    //     order:"Craft", level:5,
    //     description:``
    // },
    // "" : {
    //     prerequisite: "",
    //     space: "",
    //     hirelings: 0,
    //     order:"Craft", level:5,
    //     description:``
    // },
    // "" : {
    //     prerequisite: "",
    //     space: "",
    //     hirelings: 0,
    //     order:"Craft", level:5,
    //     description:``
    // },
    // "" : {
    //     prerequisite: "",
    //     space: "",
    //     hirelings: 0,
    //     order:"Craft", level:5,
    //     description:``
    // },
    // "" : {
    //     prerequisite: "",
    //     space: "",
    //     hirelings: 0,
    //     order:"Craft", level:5,
    //     description:``
    // },
    // "" : {
    //     prerequisite: "",
    //     space: "",
    //     hirelings: 0,
    //     order:"Craft", level:5,
    //     description:``
    // },
    // "" : {
    //     prerequisite: "",
    //     space: "",
    //     hirelings: 0,
    //     order:"Craft", level:5,
    //     description:``
    // },
    // "" : {
    //     prerequisite: "",
    //     space: "",
    //     hirelings: 0,
    //     order:"Craft", level:5,
    //     description:``
    // },
    // "" : {
    //     prerequisite: "",
    //     space: "",
    //     hirelings: 0,
    //     order:"Craft", level:5,
    //     description:``
    // },
    // "" : {
    //     prerequisite: "",
    //     space: "",
    //     hirelings: 0,
    //     order:"Craft", level:5,
    //     description:``
    // },
    // "" : {
    //     prerequisite: "",
    //     space: "",
    //     hirelings: 0,
    //     order:"Craft", level:5,
    //     description:``
    // },
    // "" : {
    //     prerequisite: "",
    //     space: "",
    //     hirelings: 0,
    //     order:"Craft", level:5,
    //     description:``
    // },
    // "" : {
    //     prerequisite: "",
    //     space: "",
    //     hirelings: 0,
    //     order:"Craft", level:5,
    //     description:``
    // },
    // "" : {
    //     prerequisite: "",
    //     space: "",
    //     hirelings: 0,
    //     order:"Craft", level:5,
    //     description:``
    // },
    // "" : {
    //     prerequisite: "",
    //     space: "",
    //     hirelings: 0,
    //     order:"Craft", level:5,
    //     description:``
    // },
    // "" : {
    //     prerequisite: "",
    //     space: "",
    //     hirelings: 0,
    //     order:"Craft", level:5,
    //     description:``
    // },
    // "" : {
    //     prerequisite: "",
    //     space: "",
    //     hirelings: 0,
    //     order:"Craft", level:5,
    //     description:``
    // },
    // "" : {
    //     prerequisite: "",
    //     space: "",
    //     hirelings: 0,
    //     order:"Craft", level:5,
    //     description:``
    // },
    // "" : {
    //     prerequisite: "",
    //     space: "",
    //     hirelings: 0,
    //     order:"Craft", level:5,
    //     description:``
    // },
    // "" : {
    //     prerequisite: "",
    //     space: "",
    //     hirelings: 0,
    //     order:"Craft", level:5,
    //     description:``
    // },
    // "" : {
    //     prerequisite: "",
    //     space: "",
    //     hirelings: 0,
    //     order:"Craft", level:5,
    //     description:``
    // },
    // "" : {
    //     prerequisite: "",
    //     space: "",
    //     hirelings: 0,
    //     order:"Craft", level:5,
    //     description:``
    // },
    // "" : {
    //     prerequisite: "",
    //     space: "",
    //     hirelings: 0,
    //     order:"Craft", level:5,
    //     description:``
    // },
    // "" : {
    //     prerequisite: "",
    //     space: "",
    //     hirelings: 0,
    //     order:"Craft", level:5,
    //     description:``
    // },
    // "" : {
    //     prerequisite: "",
    //     space: "",
    //     hirelings: 0,
    //     order:"Craft", level:5,
    //     description:``
    // },
    // "" : {
    //     prerequisite: "",
    //     space: "",
    //     hirelings: 0,
    //     order:"Craft", level:5,
    //     description:``
    // },
    // "" : {
    //     prerequisite: "",
    //     space: "",
    //     hirelings: 0,
    //     order:"Craft", level:5,
    //     description:``
    // },
    // "" : {
    //     prerequisite: "",
    //     space: "",
    //     hirelings: 0,
    //     order:"Craft", level:5,
    //     description:``
    // },
    // "" : {
    //     prerequisite: "",
    //     space: "",
    //     hirelings: 0,
    //     order:"Craft", level:5,
    //     description:``
    // },
    // "" : {
    //     prerequisite: "",
    //     space: "",
    //     hirelings: 0,
    //     order:"Craft", level:5,
    //     description:``
    // },
    // "" : {
    //     prerequisite: "",
    //     space: "",
    //     hirelings: 0,
    //     order:"Craft", level:5,
    //     description:``
    // },
    // "" : {
    //     prerequisite: "",
    //     space: "",
    //     hirelings: 0,
    //     order:"Craft", level:5,
    //     description:``
    // },
    // "" : {
    //     prerequisite: "",
    //     space: "",
    //     hirelings: 0,
    //     order:"Craft", level:5,
    //     description:``
    // },
    // "" : {
    //     prerequisite: "",
    //     space: "",
    //     hirelings: 0,
    //     order:"Craft", level:5,
    //     description:``
    // },
    // "" : {
    //     prerequisite: "",
    //     space: "",
    //     hirelings: 0,
    //     order:"Craft", level:5,
    //     description:``
    // }
}

document.getElementById("bastionRoomSelect").innerHTML = Object.keys(premadeRooms).sort(function(a,b) {
    if (premadeRooms[a].level == premadeRooms[b].level) return a.localeCompare(b);
    return premadeRooms[a].level - premadeRooms[b].level;
}).map(o=>premadeRooms[o].level?("<option>"+o+" (Level "+premadeRooms[o].level+")</option>"):"<option>"+o+"</option>");

// This one has every bastion facility
// eyJkaXJlY3Rpb24iOiJMZWZ0IiwiZGVjb3JhdGlvbiI6IldhdGVyIFRpbGUiLCJyb29tTiI6MCwiZG9vcnMiOnsidG9wIjpbXSwiYm90dG9tIjpbXSwibGVmdCI6W10sInJpZ2h0IjpbXX0sIndhbGxzIjp7InRvcCI6W10sImJvdHRvbSI6W10sImxlZnQiOltdLCJyaWdodCI6W119LCJyb29tRGVzY3JpcHRpb25zIjpbIiIsIlRocmVlIGludGFjdCBib2RpZXMgbGllIGhlcmUsIGFuZCBzdXBwb3J0cyBsaW5lIHRoZSBjZWlsaW5nLiBUaGlzIHJvb20gbG9va3MgbGlrZSBpdCBoYXMgYmVlbiBtb3N0bHkgY2hpc2VsZWQgb3V0LCB3aXRoIGEgYml0IGF0IHRoZSBmcm9udCB0aGF0IHNlZW1zIGxpa2UgdGhlIG5hdHVyYWwgaWduZW91cyByb2NrIHN1cmZhY2Ugb2YgdGhlIHJlc3Qgb2YgdGhlIEJsZWFrbGFuZHMuIiwiVGhpcyBoYWxsd2F5IGlzIGxvbmcgYW5kIHdpbmRpbmcsIHNsb3BpbmcgZG93biB0aGUgd2hvbGUgdGltZSwgYW5kIGhhcyBiZWVuIGNoaXNlbGVkIG91dCBieSBtaW5pbmcgcGlja3MuIiwiSW4gdGhpcyBjcm9vayB3aGVyZSB0aGUgZGVzY2VuZGluZyB0dW5uZWwgYmVuZHMsIHRoZXJlIGlzIGEgYnJ1dGFsIHNjZW5lLiBUaHJlZSBkd2FydmVzIGxpZSBpbiBhIHBvb2wgb2YgZHJpZWQgYmxvb2QsIGN1dCBhbGwgb3Zlci5cblxuTWVkaWNpbmUgb3IgcGVyY2VwdGlvbiB0byBkZXRlcm1pbmUgdGhhdCBhIHdpbGQgYW5pbWFsIG9yIHNvbWVvbmUgaW4gYSBibGluZCByYWdlIG1hZGUgdGhlIGN1dHMuIFxuXG5BIG5hdHVyZSBjaGVjayB0byBkZXRlcm1pbmUgdGhhdCB0aGUgY2xhd3Mgd2VyZSBpbnNlY3RpbGUgaW4gYXBwZWFyYW5jZSwgYnV0IHZlcnkgbGFyZ2UuIiwiT24gdGhlIHdheSBvdXQgb2YgdGhlIG1pbmUsIGEgcmVtbmFudCB3aXRoIHRoZSBmb2xsb3dpbmcgZWZmZWN0cyBhdHRhY2tzIHRoZSBwbGF5ZXJzLiBBcyBpdCBpcyBvbiB0aGUgY2VpbGluZywgaXQgaXMgZGlmZmljdWx0IHRvIHNlZSBhbmQgbWlnaHQgZ2V0IHRoZSBqdW1wLlxuXG5Vc2UgdGhlIFZldGVyYW4gc3RhdCBibG9jaywgd2hlcmUgdGhlIGxvbmdzd29yZCBhdHRhY2tzIGFyZSBjbGF3cywgdGhlIHNob3J0c3dvcmQgYXR0YWNrcyBhcmUgYml0ZXMsIGFuZCBpbnN0ZWFkIG9mIHRoZSBoZWF2eSBjcm9zc2JvdyBpdCBjYW4gdGhyb3cgc3RvbmVzLiBJdHMgQUMgaXMgMTRcblxuV3JvbmduZXNzOiBXZWlnaHRsZXNzbmVzc1xuUGFzc2l2ZTogQ292ZXJlZCBpbiBTbWFsbCBUZW50YWNsZXNcbkFjdGl2ZTogR3Jhdml0eSBzaGlmdGluZyIsIlRoaXMgcm9vbSBpcyByb3VnaGx5IGNpcmN1bGFyIGJlc2lkZXMgYSBzZWdtZW50IG9uIHRoZSBsZWZ0IHdhbGwgdGhhdCBzdGlja3Mgb3V0LiBcblxuUGVyY2VwdGlvbiBjaGVjayBvciBhIGxvdCBvZiB0aW1lIHJldmVhbHMgdGhhdCB0aGVyZSBpcyBhIGxpdHRsZSBob2xlIGluIHRoZSBzZWdtZW50IGxlZnQsIGEgc21vb3RoIGRpdm90IHRoYXQgaXMgY3lsaW5kcmljYWwgd2l0aCBhIHJvdW5kZWQgZW5kLlxuXG5JbnZlc3RpZ2F0aW9uIGFmdGVyIHRoZSBwZXJjZXB0aW9uIHJldmVhbHMgdGhhdCB0aGUgbWluZXJzIHByb2JhYmx5IGZvdW5kIHRoZSB0aGluZyBpbiB0aGUgZGl2b3QgYW5kIGxlZnQsIHRoYXQgd2FzIHdoYXQgdGhleSB3ZXJlIHNlYXJjaGluZyBmb3IuIEEgaGlnaCBjaGVjayByZXZlYWxzIHRoYXQgdGhleSBwcm9iYWJseSBrbmV3IHRoZSByb3VnaCBsb2NhdGlvbiBvZiB3aGF0ZXZlciB0aGV5IHdlcmUgc2VhcmNoaW5nIGZvciBhbmQgd2VyZSBtaW5pbmcgbWV0aG9kaWNhbGx5IHRvIGZpbmQgaXQuIl0sImRlY29yYXRpb25zIjp7IndhdGVyLXRpbGUiOltdLCJjaXJjdWxhci1vYmplY3QiOltdLCJzcXVhcmUtb2JqZWN0IjpbXX0sImRyYXdNb2RlIjoiYm94Iiwicm9vbSI6NSwibW9kZSI6InZpZXciLCJib2FyZCI6Wy{0xLC},{768}0xLDUsNSw1LDU{sLTE},{45}sNSw1LDUsNSw1LDU{sLTE},{43}sNSw1LDUsNSw1LDUsNSw1{LC0x},{43}LDUsNSw1LDUsNSw1LDU{sLTE},{44}sNSw1LDUsNSw1LDUsN{SwtM},{43}Sw1LDUsNSw1LDUsN{SwtM},{41}Sw1LDUsNSw1LDUsNSw1LDUsNSw1{LC0x},{40}LDUsNSw1LDUsNSw1LDUsNSw1LDU{sLTE},{40}sNSw1LDUsNSw1LDUsNSw1LDU{sLTE},{42}sNSw1LDUsNSw1LDUsNSw1{LC0x},{41}LDIsNSw1LDUsNSw1LDUsNS{wtMS},{41}wyLDIsMiwtMSw1LDUsNSw1{LC0x},{42}LDIsMi{wtMS},{43}{wtMS},{4}wyLDIsMiw{tMSw},{43}{tMSw},{4}yLDIs{LTEs},{45}LTEsLTEsMiwy{LC0x},{48}LDIsMiwt{MSwt},{42}{MSwt},{5}MSwyLDIsLTEsLTEsMywzLDIs{LTEs},{43}MiwyLDIsMywzLDMsMiwyL{C0xL},{43}DIsMiwzLDMsLTEsMiwyL{C0xL},{48}DIsMiwtM{SwtM},{42}{SwtM},{4}Sw0LDIsL{TEsL},{44}{TEsL},{3}TEsNCw0LC{0xLC},{47}0xLDQsNC{wtMS},{42}{wtMS},{5}wyLDIsNCw{tMSw},{42}{tMSw},{5}yLDIsLT{EsLT},{44}{EsLT},{3}EsMiwyLC0{xLC0},{47}xLDIsMiwt{MSwt},{41}{MSwt},{6}MSwyLDIs{LTEs},{44}{LTEs},{4}Miwy{LC0x},{47}LC0xLDEsMSw{tMSw},{41}{tMSw},{6}xLDEsMSw{xLC0},{46}xLDEsMSwxLDEsL{TEsL},{43}TEsLTEsLTEsMSwxLDEs{MSwt},{40}M{SwtM},{6}SwxLDEsMSw{xLC0},{30}xXX0=