exports.estimateCO2 = function(material, quantity, unit = 'kg') { // (1)
  // For MVP: assume quantity in kg
  const factors = { plastic: 2.5, glass: 0.5, metal: 3.0, paper: 1.2 }; // (2)
  const factor = factors[String(material).toLowerCase()] || 1.0; // (3)
  return factor * Number(quantity); // (4)
};
