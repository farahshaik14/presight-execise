import type { Region } from "./portraits.js";

export interface Nationality {
  name: string;
  region: Region;
  weight: number;
  male: string[];
  female: string[];
  last: string[];
}

const list = (names: string) => names.split(",").map((n) => n.trim());

export const NATIONALITIES: Nationality[] = [
  {
    name: "British", region: "europe", weight: 7,
    male: list("Oliver, George, Harry, Jack, Charlie, Thomas, James, William"),
    female: list("Olivia, Amelia, Isla, Emily, Sophie, Grace, Lily, Charlotte"),
    last: list("Smith, Jones, Taylor, Brown, Williams, Wilson, Evans, Thomas, Roberts, Walker"),
  },
  {
    name: "Irish", region: "europe", weight: 3,
    male: list("Conor, Sean, Cian, Darragh, Liam, Oisin, Patrick, Niall"),
    female: list("Aoife, Saoirse, Niamh, Ciara, Siobhan, Roisin, Caoimhe, Orla"),
    last: list("Murphy, Kelly, O'Sullivan, Walsh, O'Brien, Byrne, Ryan, O'Connor, Doyle, McCarthy"),
  },
  {
    name: "French", region: "europe", weight: 5,
    male: list("Louis, Gabriel, Hugo, Arthur, Jules, Lucas, Théo, Mathis"),
    female: list("Emma, Chloé, Léa, Manon, Camille, Inès, Juliette, Margaux"),
    last: list("Martin, Bernard, Dubois, Durand, Lefebvre, Moreau, Laurent, Girard, Fournier, Mercier"),
  },
  {
    name: "German", region: "europe", weight: 5,
    male: list("Lukas, Felix, Jonas, Leon, Maximilian, Paul, Niklas, Moritz"),
    female: list("Hannah, Lena, Mia, Lea, Sophia, Marie, Johanna, Clara"),
    last: list("Müller, Schmidt, Schneider, Fischer, Weber, Meyer, Wagner, Becker, Hoffmann, Schulz"),
  },
  {
    name: "Italian", region: "europe", weight: 4,
    male: list("Leonardo, Francesco, Alessandro, Lorenzo, Matteo, Giuseppe, Marco, Luca"),
    female: list("Giulia, Sofia, Aurora, Alice, Chiara, Francesca, Martina, Elena"),
    last: list("Rossi, Russo, Ferrari, Esposito, Bianchi, Romano, Colombo, Ricci, Marino, Greco"),
  },
  {
    name: "Spanish", region: "europe", weight: 4,
    male: list("Hugo, Mateo, Martín, Pablo, Alejandro, Daniel, Javier, Diego"),
    female: list("Lucía, Sofía, Martina, María, Paula, Carmen, Elena, Alba"),
    last: list("García, Fernández, González, Rodríguez, López, Martínez, Sánchez, Pérez, Gómez, Ruiz"),
  },
  {
    name: "Dutch", region: "europe", weight: 2,
    male: list("Daan, Sem, Lucas, Finn, Bram, Jesse, Thijs, Ruben"),
    female: list("Emma, Julia, Sanne, Fleur, Lotte, Anouk, Femke, Noor"),
    last: list("de Jong, Jansen, de Vries, van den Berg, Bakker, Visser, Smit, Meijer, Mulder, de Boer"),
  },
  {
    name: "Swedish", region: "europe", weight: 2,
    male: list("Erik, Lars, Oscar, Axel, Elias, Anders, Johan, Viktor"),
    female: list("Elsa, Astrid, Maja, Ebba, Freja, Ingrid, Linnea, Saga"),
    last: list("Andersson, Johansson, Karlsson, Nilsson, Eriksson, Larsson, Olsson, Persson, Lindqvist, Berg"),
  },
  {
    name: "Nigerian", region: "africa", weight: 20,
    male: list("Chinedu, Emeka, Oluwaseun, Tunde, Ifeanyi, Babatunde, Obinna, Adebayo"),
    female: list("Ngozi, Chiamaka, Funmilayo, Adaeze, Yetunde, Amaka, Folake, Nkechi"),
    last: list("Okafor, Adeyemi, Okonkwo, Balogun, Eze, Ogunleye, Nwosu, Adeleke, Okoro, Afolabi"),
  },
  {
    name: "Kenyan", region: "africa", weight: 12,
    male: list("Kamau, Otieno, Mwangi, Kiprono, Baraka, Juma, Njoroge, Ochieng"),
    female: list("Wanjiku, Achieng, Njeri, Akinyi, Wambui, Chebet, Nyambura, Atieno"),
    last: list("Kariuki, Odhiambo, Mutua, Kipchoge, Wafula, Omondi, Kimani, Cheruiyot, Owino, Ndungu"),
  },
  {
    name: "Ghanaian", region: "africa", weight: 12,
    male: list("Kwame, Kofi, Kwabena, Yaw, Kojo, Kwaku, Nana, Kwesi"),
    female: list("Ama, Akosua, Abena, Efua, Adwoa, Afia, Yaa, Esi"),
    last: list("Mensah, Owusu, Boateng, Asante, Osei, Appiah, Agyeman, Darko, Ofori, Amoah"),
  },
  {
    name: "Senegalese", region: "africa", weight: 6,
    male: list("Mamadou, Moussa, Abdoulaye, Ousmane, Cheikh, Ibrahima, Modou, Babacar"),
    female: list("Fatou, Aminata, Awa, Mariama, Khady, Ndeye, Aissatou, Coumba"),
    last: list("Diop, Ndiaye, Fall, Sow, Diallo, Gueye, Faye, Sarr, Mbaye, Ba"),
  },
  {
    name: "Jamaican", region: "africa", weight: 10,
    male: list("Andre, Marlon, Damian, Jermaine, Omar, Kemar, Ricardo, Shane"),
    female: list("Shanice, Tanisha, Kimberly, Alicia, Kerry-Ann, Simone, Nadine, Renee"),
    last: list("Campbell, Brown, Williams, Thompson, Clarke, Reid, Grant, Morgan, McKenzie, Gordon"),
  },
  {
    name: "Emirati", region: "middle_east", weight: 5,
    male: list("Mohammed, Ahmed, Khalid, Saeed, Rashid, Hamdan, Sultan, Saif"),
    female: list("Fatima, Mariam, Aisha, Noura, Hessa, Shamma, Latifa, Maitha"),
    last: list("Al Mansoori, Al Hashemi, Al Mazrouei, Al Ketbi, Al Falasi, Al Suwaidi, Al Dhaheri, Al Shamsi, Al Nuaimi, Al Ali"),
  },
  {
    name: "Saudi", region: "middle_east", weight: 4,
    male: list("Abdullah, Faisal, Turki, Fahad, Saud, Nawaf, Abdulaziz, Majed"),
    female: list("Reem, Lama, Sara, Haya, Nouf, Dana, Jawaher, Ghada"),
    last: list("Al Qahtani, Al Ghamdi, Al Otaibi, Al Harbi, Al Zahrani, Al Dosari, Al Shehri, Al Mutairi, Al Anazi, Al Shammari"),
  },
  {
    name: "Egyptian", region: "middle_east", weight: 4,
    male: list("Mahmoud, Mostafa, Omar, Youssef, Karim, Tarek, Amr, Hossam"),
    female: list("Nour, Yasmin, Salma, Mona, Heba, Dina, Rana, Mariam"),
    last: list("Hassan, Ibrahim, Abdelrahman, El Sayed, Mahmoud, Fathy, Soliman, Farouk, Shalaby, Mansour"),
  },
  {
    name: "Jordanian", region: "middle_east", weight: 2,
    male: list("Zaid, Hamza, Laith, Yazan, Omar, Tareq, Ali, Rami"),
    female: list("Leen, Rania, Tala, Dana, Lina, Rasha, Hala, Yara"),
    last: list("Haddad, Al Khatib, Nasser, Obeidat, Al Zoubi, Masri, Hijazi, Khoury, Tamimi, Saleh"),
  },
  {
    name: "Lebanese", region: "middle_east", weight: 2,
    male: list("Elie, Georges, Karim, Fadi, Charbel, Rami, Ziad, Nabil"),
    female: list("Maya, Nadine, Rita, Lara, Carla, Joelle, Nour, Rima"),
    last: list("Khoury, Haddad, Saab, Karam, Nassar, Matar, Sfeir, Daher, Azar, Abboud"),
  },
  {
    name: "Moroccan", region: "middle_east", weight: 1,
    male: list("Youssef, Mehdi, Hamza, Amine, Anas, Soufiane, Rachid, Hicham"),
    female: list("Salma, Imane, Khadija, Meryem, Zineb, Hajar, Soukaina, Ghita"),
    last: list("Benali, El Amrani, Alaoui, Bennani, Tazi, Berrada, El Idrissi, Chraibi, Lahlou, Benjelloun"),
  },
  {
    name: "Indian", region: "south_asia", weight: 3,
    male: list("Aarav, Rohan, Arjun, Vikram, Rahul, Karan, Aditya, Siddharth"),
    female: list("Priya, Ananya, Kavya, Diya, Aishwarya, Neha, Pooja, Shreya"),
    last: list("Sharma, Patel, Iyer, Reddy, Nair, Gupta, Singh, Menon, Desai, Kulkarni"),
  },
  {
    name: "Pakistani", region: "south_asia", weight: 1,
    male: list("Usman, Bilal, Hamza, Ali, Faisal, Imran, Zain, Hassan"),
    female: list("Ayesha, Fatima, Hira, Sana, Mahnoor, Zainab, Sadia, Iqra"),
    last: list("Khan, Ahmed, Malik, Qureshi, Butt, Chaudhry, Raza, Siddiqui, Sheikh, Mirza"),
  },
  {
    name: "Bangladeshi", region: "south_asia", weight: 1,
    male: list("Rafiq, Tanvir, Arif, Sakib, Rahim, Imran, Nayeem, Shahid"),
    female: list("Nusrat, Farzana, Taslima, Sharmin, Rumana, Tahmina, Jannatul, Sadia"),
    last: list("Hossain, Rahman, Islam, Uddin, Akter, Chowdhury, Haque, Sarkar, Alam, Karim"),
  },
  {
    name: "Chinese", region: "east_asia", weight: 5,
    male: list("Wei, Jun, Hao, Lei, Yang, Ming, Jie, Tao"),
    female: list("Mei, Xin, Li, Yan, Jing, Hui, Ying, Fang"),
    last: list("Wang, Li, Zhang, Liu, Chen, Yang, Huang, Zhao, Wu, Zhou"),
  },
  {
    name: "Japanese", region: "east_asia", weight: 4,
    male: list("Haruto, Sota, Yuto, Ren, Takumi, Kenji, Daiki, Hiroshi"),
    female: list("Yui, Sakura, Hina, Aoi, Yuna, Mio, Haruka, Akari"),
    last: list("Sato, Suzuki, Takahashi, Tanaka, Watanabe, Ito, Yamamoto, Nakamura, Kobayashi, Kato"),
  },
  {
    name: "Korean", region: "east_asia", weight: 3,
    male: list("Min-jun, Seo-jun, Ji-ho, Do-yun, Hyun-woo, Jae-won, Sung-min, Tae-yang"),
    female: list("Seo-yeon, Ji-woo, Ha-eun, Min-seo, Ye-jin, Su-ah, Ji-min, Eun-ji"),
    last: list("Kim, Lee, Park, Choi, Jung, Kang, Cho, Yoon, Jang, Lim"),
  },
  {
    name: "Filipino", region: "southeast_asia", weight: 5,
    male: list("Jose, Mark, John Paul, Angelo, Carlo, Miguel, Paolo, Rafael"),
    female: list("Maria, Angel, Kristine, Joy, Camille, Patricia, Bea, Andrea"),
    last: list("Santos, Reyes, Cruz, Bautista, Garcia, Mendoza, Del Rosario, Villanueva, Ramos, Aquino"),
  },
  {
    name: "Indonesian", region: "southeast_asia", weight: 3,
    male: list("Budi, Agus, Rizky, Dimas, Andi, Fajar, Hendra, Bayu"),
    female: list("Siti, Dewi, Putri, Ayu, Rina, Wulan, Indah, Lestari"),
    last: list("Santoso, Wijaya, Saputra, Hidayat, Pratama, Kusuma, Nugroho, Setiawan, Gunawan, Halim"),
  },
  {
    name: "Vietnamese", region: "southeast_asia", weight: 2,
    male: list("Minh, Huy, Duc, Nam, Khoa, Long, Tuan, Quang"),
    female: list("Linh, Lan, Huong, Mai, Trang, Thao, Ngoc, Phuong"),
    last: list("Nguyen, Tran, Le, Pham, Hoang, Phan, Vu, Dang, Bui, Do"),
  },
  {
    name: "Mexican", region: "latin_america", weight: 6,
    male: list("Santiago, Diego, Emiliano, Luis, Carlos, Jorge, Alejandro, Miguel"),
    female: list("Ximena, Valentina, Fernanda, Guadalupe, Daniela, Mariana, Regina, Camila"),
    last: list("Hernández, García, Martínez, López, González, Ramírez, Flores, Torres, Vázquez, Morales"),
  },
  {
    name: "Brazilian", region: "latin_america", weight: 5,
    male: list("João, Pedro, Lucas, Gabriel, Rafael, Thiago, Bruno, Matheus"),
    female: list("Ana, Beatriz, Larissa, Júlia, Camila, Fernanda, Mariana, Gabriela"),
    last: list("Silva, Santos, Oliveira, Souza, Lima, Pereira, Costa, Ferreira, Almeida, Carvalho"),
  },
  {
    name: "Colombian", region: "latin_america", weight: 3,
    male: list("Andrés, Sebastián, Camilo, Julián, Felipe, Juan David, Esteban, Mauricio"),
    female: list("Valentina, Isabella, Catalina, Laura, Natalia, Paola, Daniela, Juliana"),
    last: list("Rodríguez, Gómez, Restrepo, Cardona, Jaramillo, Ospina, Vargas, Castro, Moreno, Rojas"),
  },
  {
    name: "Argentine", region: "latin_america", weight: 2,
    male: list("Matías, Facundo, Nicolás, Martín, Joaquín, Agustín, Tomás, Federico"),
    female: list("Sofía, Florencia, Camila, Agustina, Lucía, Micaela, Valentina, Carolina"),
    last: list("Fernández, González, Rodríguez, López, Gómez, Díaz, Romero, Álvarez, Benítez, Acosta"),
  },
];

export const HOBBIES = [
  "Reading", "Hiking", "Cooking", "Photography", "Gaming", "Cycling", "Swimming",
  "Painting", "Gardening", "Yoga", "Running", "Chess", "Fishing", "Dancing",
  "Knitting", "Traveling", "Writing", "Singing", "Guitar", "Piano", "Baking",
  "Camping", "Pottery", "Surfing", "Skiing", "Bird Watching", "Calligraphy",
  "Rock Climbing", "Martial Arts", "Volunteering", "Astronomy", "Origami",
  "Board Games", "Podcasting", "Sewing", "Skateboarding", "Tennis", "Football",
  "Basketball", "Meditation",
];
