import { useState } from 'react';

// Fonction de débogage des dates
function generateScheduleDates(
  startDate: Date, 
  endDate: Date, 
  selectedWeekdays: number[]
): Date[] {
  console.log('🔍 DÉBUT Génération des dates');
  console.log('Date de début:', startDate.toISOString());
  console.log('Date de fin:', endDate.toISOString());
  console.log('Jours sélectionnés:', selectedWeekdays);

  const scheduleDates: Date[] = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const currentDay = currentDate.getDay();
    console.log('Date courante:', currentDate.toISOString());
    console.log('Jour courant:', currentDay);

    if (selectedWeekdays.includes(currentDay)) {
      const scheduledDate = new Date(
        currentDate.getFullYear(), 
        currentDate.getMonth(), 
        currentDate.getDate(), 
        12, 0, 0
      );

      console.log('✅ Date programmée ajoutée:', scheduledDate.toISOString());
      scheduleDates.push(scheduledDate);
    }

    // Ajouter un jour
    currentDate.setDate(currentDate.getDate() + 1);
  }

  console.log('🔍 FIN Génération des dates');
  scheduleDates.forEach(date => {
    console.log('Date finale:', date.toISOString(), 'Jour:', date.getDay());
  });

  return scheduleDates;
}

// Fonction de test
function testDateGeneration() {
  const now = new Date();
  now.setHours(12, 0, 0, 0);  // Mettre à midi

  const endDate = new Date(now);
  endDate.setDate(now.getDate() + 14);  // 2 semaines plus tard

  console.log('🚀 TEST DE GÉNÉRATION DE DATES');
  console.log('Date de départ:', now.toISOString());
  console.log('Date de fin:', endDate.toISOString());

  // Test dimanche (0)
  const sundayDates = generateScheduleDates(now, endDate, [0]);
}

// Simulation d'exécution
testDateGeneration();
