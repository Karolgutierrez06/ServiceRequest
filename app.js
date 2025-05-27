document.getElementById('formSolicitudProcedimiento').addEventListener('submit', function(event) {
  event.preventDefault();

  // Obtener los valores del formulario
  const nombrePaciente    = document.getElementById('nombrePaciente').value;
  const fechaConsulta     = document.getElementById('fechaConsulta').value;
  const nombreMedico      = document.getElementById('nombreMedico').value;
  const cedulaMedico      = document.getElementById('cedulaMedico').value;
  const diagnostico       = document.getElementById('diagnostico').value;
  const procedimiento     = document.getElementById('procedimiento').value;
  const justificacion     = document.getElementById('justificacion').value;
  const fechaOpcion1      = document.getElementById('fechaOpcion1').value;
  const fechaOpcion2      = document.getElementById('fechaOpcion2').value;
  const fechaOpcion3      = document.getElementById('fechaOpcion3').value;
  const horarioPreferente = document.getElementById('horarioPreferente').value;

  // Crear un identificador único para la solicitud (puedes usar un UUID si es necesario)
  const identificadorSolicitud = 'solicitud-' + Date.now();

  // Construir el recurso FHIR ServiceRequest
  const serviceRequestFHIR = {
    resourceType: "ServiceRequest",
    id: identificadorSolicitud,
    status: "active",  // o "draft", según el flujo de trabajo
    intent: "order",
    priority: "urgent",  // puede ser: routine | urgent | asap | stat
    code: {
      text: procedimiento  // Ejemplo: "Apendicectomía"
    },
    subject: {
      reference: "Patient/" + nombrePaciente.replace(/\s/g, '-').toLowerCase(),
      display: nombrePaciente
    },
    requester: {
      reference: "Practitioner/" + cedulaMedico,
      display: nombreMedico
    },
    authoredOn: fechaConsulta,
    reasonCode: [
      {
        text: diagnostico
      }
    ],
    note: [
      {
        text: "Justificación: " + justificacion
      },
      {
        text: "Fechas disponibles: " + [fechaOpcion1, fechaOpcion2, fechaOpcion3].join(', ')
      },
      {
        text: "Horario preferente: " + horarioPreferente
      }
    ]
  };

  console.log('Recurso FHIR ServiceRequest:', serviceRequestFHIR);

  // Enviar la solicitud al backend
  fetch('https://hl7-fhir-ehr-karol-1.onrender.com/service-request/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(serviceRequestFHIR)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Error en la solicitud: ' + response.statusText);
    }
    return response.json();
  })
  .then(data => {
    console.log('Success:', data);
    alert('Solicitud de procedimiento creada exitosamente! ID: ' + data.id);
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Hubo un error en la solicitud: ' + error.message);
  });
});
