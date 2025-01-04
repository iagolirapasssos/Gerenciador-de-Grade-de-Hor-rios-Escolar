// Estrutura de dados para séries e turmas
let classes = [];
let currentClassId = null;
let editingClassId = null;

// Objeto para armazenar grades por turma
let schedulesByClass = {};

function saveToCache() {
    const data = {
        teachers,
        classes,
        schedulesByClass,
        breaks,
        settings: {
            startTimeMorning: document.getElementById('startTimeMorning').value,
            endTimeMorning: document.getElementById('endTimeMorning').value,
            startTimeAfternoon: document.getElementById('startTimeAfternoon').value,
            endTimeAfternoon: document.getElementById('endTimeAfternoon').value,
            startTimeNight: document.getElementById('startTimeNight').value,
            endTimeNight: document.getElementById('endTimeNight').value,
            classDuration: document.getElementById('classDuration').value,
            breakCount: document.getElementById('breakCount').value
        }
    };
    localStorage.setItem('scheduleData', JSON.stringify(data));
    alert('Dados salvos com sucesso!');
}

function loadFromCache() {
    const data = localStorage.getItem('scheduleData');
    if (data) {
        const parsed = JSON.parse(data);
        teachers = parsed.teachers || [];
        classes = parsed.classes || [];
        schedulesByClass = parsed.schedulesByClass || {};
        breaks = parsed.breaks || [];
        
        // Restaurar configurações
        if (parsed.settings) {
            Object.entries(parsed.settings).forEach(([key, value]) => {
                const element = document.getElementById(key);
                if (element) element.value = value;
            });
        }
        
        updateTeachersList();
        updateTeacherSelect();
        updateClassList();
        updateClassSelect();
        updateBreakInputs();
        generateSchedule();
    }
}

function addClass() {
    const gradeName = document.getElementById('gradeName').value.trim();
    const className = document.getElementById('className').value.trim();
    
    if (!gradeName || !className) {
        alert('Por favor, preencha série e turma.');
        return;
    }

    const newClass = {
        id: Date.now().toString(),
        gradeName,
        className,
        fullName: `${gradeName} ${className}`
    };

    classes.push(newClass);
    schedulesByClass[newClass.id] = {
        teacherSchedules: {},
        finalSchedule: {}
    };
    
    updateClassList();
    updateClassSelect();
    clearClassForm();
}

function updateClass() {
    if (!editingClassId) return;
    
    const gradeName = document.getElementById('gradeName').value.trim();
    const className = document.getElementById('className').value.trim();
    
    if (!gradeName || !className) {
        alert('Por favor, preencha série e turma.');
        return;
    }

    const classIndex = classes.findIndex(c => c.id === editingClassId);
    if (classIndex !== -1) {
        classes[classIndex] = {
            ...classes[classIndex],
            gradeName,
            className,
            fullName: `${gradeName} ${className}`
        };
        
        updateClassList();
        updateClassSelect();
        clearClassForm();
    }
}

function editClass(id) {
    editingClassId = id;
    const classObj = classes.find(c => c.id === id);
    
    document.getElementById('gradeName').value = classObj.gradeName;
    document.getElementById('className').value = classObj.className;
    
    document.getElementById('addClassBtn').style.display = 'none';
    document.getElementById('updateClassBtn').style.display = 'inline';
    document.getElementById('cancelClassEditBtn').style.display = 'inline';
}

function deleteClass(id) {
    if (confirm('Tem certeza que deseja excluir esta turma?')) {
        classes = classes.filter(c => c.id !== id);
        delete schedulesByClass[id];
        
        if (currentClassId === id) {
            currentClassId = null;
            document.getElementById('currentClass').value = '';
        }
        
        updateClassList();
        updateClassSelect();
        refreshScheduleView();
    }
}

function clearClassForm() {
    editingClassId = null;
    document.getElementById('gradeName').value = '';
    document.getElementById('className').value = '';
    
    document.getElementById('addClassBtn').style.display = 'inline';
    document.getElementById('updateClassBtn').style.display = 'none';
    document.getElementById('cancelClassEditBtn').style.display = 'none';
}

function cancelClassEdit() {
    clearClassForm();
}

function updateClassList() {
    const container = document.getElementById('classesList');
    container.innerHTML = classes.map(classObj => `
        <div class="class-card">
            <div class="edit-buttons">
                <button class="edit-button" onclick="editClass('${classObj.id}')">Editar</button>
                <button class="delete-button" onclick="deleteClass('${classObj.id}')">Excluir</button>
            </div>
            <strong>${classObj.fullName}</strong>
        </div>
    `).join('');
}

function updateClassSelect() {
    const select = document.getElementById('currentClass');
    select.innerHTML = '<option value="">Selecione uma turma</option>' +
        classes.map(classObj => `
            <option value="${classObj.id}" ${classObj.id === currentClassId ? 'selected' : ''}>
                ${classObj.fullName}
            </option>
        `).join('');
}

function updateCurrentClass() {
    currentClassId = document.getElementById('currentClass').value;
    if (currentClassId && schedulesByClass[currentClassId]) {
        teacherSchedules = schedulesByClass[currentClassId].teacherSchedules;
        finalSchedule = schedulesByClass[currentClassId].finalSchedule;
    } else {
        teacherSchedules = {};
        finalSchedule = {};
    }
    refreshScheduleView();
}

// Modificar as funções existentes para trabalhar com a turma atual
function toggleMark(cellId) {
    if (!currentClassId) {
        alert('Por favor, selecione uma turma primeiro.');
        return;
    }
    if (!currentTeacherId) {
        alert('Por favor, selecione um professor primeiro.');
        return;
    }

    const cell = document.getElementById(cellId);
    const currentTeacher = teachers.find(t => t.id === currentTeacherId);
    const currentContent = cell.innerHTML;

    if (!schedulesByClass[currentClassId].teacherSchedules[currentTeacherId]) {
        schedulesByClass[currentClassId].teacherSchedules[currentTeacherId] = {};
    }

    if (!schedulesByClass[currentClassId].teacherSchedules[currentTeacherId][cellId]) {
        if (currentContent === '') {
            cell.innerHTML = `X<div class="teacher-info">${currentTeacher.subject}<br>${currentTeacher.name}</div>`;
            schedulesByClass[currentClassId].teacherSchedules[currentTeacherId][cellId] = true;
            currentTeacher.availableSlots = (currentTeacher.availableSlots || 0) + 1;
            updateTeachersList();
        }
    } else {
        cell.innerHTML = '';
        delete schedulesByClass[currentClassId].teacherSchedules[currentTeacherId][cellId];
        currentTeacher.availableSlots--;
        updateTeachersList();
    }
}

// O resto do código permanece o mesmo, apenas atualizando as referências 
// para usar schedulesByClass[currentClassId] onde apropriadolet teacherSchedules = {};
let teachers = [];
let currentTeacherId = null;
let breaks = [];
let finalSchedule = {};
let editingTeacherId = null;

// Funções de Cache
function saveToCache() {
    const data = {
        teachers,
        teacherSchedules,
        breaks,
        settings: {
            startTimeMorning: document.getElementById('startTimeMorning').value,
            endTimeMorning: document.getElementById('endTimeMorning').value,
            startTimeAfternoon: document.getElementById('startTimeAfternoon').value,
            endTimeAfternoon: document.getElementById('endTimeAfternoon').value,
            startTimeNight: document.getElementById('startTimeNight').value,
            endTimeNight: document.getElementById('endTimeNight').value,
            classDuration: document.getElementById('classDuration').value,
            breakCount: document.getElementById('breakCount').value
        }
    };
    localStorage.setItem('scheduleData', JSON.stringify(data));
    alert('Dados salvos com sucesso!');
}

function loadFromCache() {
    const data = localStorage.getItem('scheduleData');
    if (data) {
        const parsed = JSON.parse(data);
        teachers = parsed.teachers;
        teacherSchedules = parsed.teacherSchedules;
        breaks = parsed.breaks;
        
        // Restaurar configurações
        if (parsed.settings) {
            Object.entries(parsed.settings).forEach(([key, value]) => {
                const element = document.getElementById(key);
                if (element) element.value = value;
            });
        }
        
        updateTeachersList();
        updateTeacherSelect();
        updateBreakInputs();
        generateSchedule();
    }
}

function clearCache() {
    if (confirm('Tem certeza que deseja limpar todos os dados?')) {
        localStorage.removeItem('scheduleData');
        location.reload();
    }
}

function formatTimeSlot(startTime, duration) {
    const start = new Date(`2024-01-01 ${startTime}`);
    const end = new Date(start.getTime() + duration * 60000);
    return `${start.toTimeString().slice(0, 5)} - ${end.toTimeString().slice(0, 5)}`;
}

function updateBreakInputs() {
    const breakCount = parseInt(document.getElementById('breakCount').value);
    const container = document.getElementById('breakInputsContainer');
    container.innerHTML = '';

    for (let i = 0; i < breakCount; i++) {
        container.innerHTML += `
            <div class="break-setting">
                <h4>Recreio ${i + 1}</h4>
                <div>
                    <label>Início: </label>
                    <input type="time" id="breakStart${i}" value="09:30">
                </div>
                <div>
                    <label>Duração (minutos): </label>
                    <input type="number" id="breakDuration${i}" value="20" min="10" max="60">
                </div>
            </div>
        `;
    }
}

function editTeacher(id) {
    editingTeacherId = id;
    const teacher = teachers.find(t => t.id === id);
    
    document.getElementById('teacherName').value = teacher.name;
    document.getElementById('subject').value = teacher.subject;
    document.getElementById('weeklyClasses').value = teacher.weeklyClasses;
    
    document.getElementById('addTeacherBtn').style.display = 'none';
    document.getElementById('updateTeacherBtn').style.display = 'inline';
    document.getElementById('cancelEditBtn').style.display = 'inline';
}

function deleteTeacher(id) {
    if (confirm('Tem certeza que deseja excluir este professor?')) {
        teachers = teachers.filter(t => t.id !== id);
        delete teacherSchedules[id];
        updateTeachersList();
        updateTeacherSelect();
        
        if (currentTeacherId === id) {
            currentTeacherId = null;
            document.getElementById('currentTeacher').value = '';
        }
        
        refreshScheduleView();
    }
}

function cancelEdit() {
    editingTeacherId = null;
    document.getElementById('teacherName').value = '';
    document.getElementById('subject').value = '';
    document.getElementById('weeklyClasses').value = '';
    
    document.getElementById('addTeacherBtn').style.display = 'inline';
    document.getElementById('updateTeacherBtn').style.display = 'none';
    document.getElementById('cancelEditBtn').style.display = 'none';
}

function updateTeacher() {
    if (!editingTeacherId) return;
    
    const name = document.getElementById('teacherName').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const weeklyClasses = parseInt(document.getElementById('weeklyClasses').value);
    
    if (!name || !subject || !weeklyClasses) {
        alert('Por favor, preencha todos os campos do professor.');
        return;
    }

    const teacherIndex = teachers.findIndex(t => t.id === editingTeacherId);
    if (teacherIndex !== -1) {
        teachers[teacherIndex] = {
            ...teachers[teacherIndex],
            name,
            subject,
            weeklyClasses
        };
        
        updateTeachersList();
        updateTeacherSelect();
        refreshScheduleView();
        cancelEdit();
    }
}

function addTeacher() {
    const name = document.getElementById('teacherName').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const weeklyClasses = parseInt(document.getElementById('weeklyClasses').value);
    
    if (!name || !subject || !weeklyClasses) {
        alert('Por favor, preencha todos os campos do professor.');
        return;
    }

    const teacher = {
        id: Date.now().toString(),
        name,
        subject,
        weeklyClasses,
        availableSlots: 0
    };

    teachers.push(teacher);
    teacherSchedules[teacher.id] = {};
    updateTeachersList();
    updateTeacherSelect();

    document.getElementById('teacherName').value = '';
    document.getElementById('subject').value = '';
    document.getElementById('weeklyClasses').value = '';
}

function updateTeachersList() {
    const container = document.getElementById('teachersList');
    container.innerHTML = teachers.map(teacher => `
        <div class="teacher-card">
            <div class="edit-buttons">
                <button class="edit-button" onclick="editTeacher('${teacher.id}')">Editar</button>
                <button class="delete-button" onclick="deleteTeacher('${teacher.id}')">Excluir</button>
            </div>
            <strong>${teacher.name}</strong>
            <div>Disciplina: ${teacher.subject}</div>
            <div>Aulas semanais: ${teacher.weeklyClasses}</div>
            <div>Slots marcados: ${teacher.availableSlots || 0}</div>
        </div>
    `).join('');
}

function updateTeacherSelect() {
    const select = document.getElementById('currentTeacher');
    select.innerHTML = '<option value="">Selecione um professor</option>' +
        teachers.map(teacher => `
            <option value="${teacher.id}" ${teacher.id === currentTeacherId ? 'selected' : ''}>
                ${teacher.name} - ${teacher.subject}
            </option>
        `).join('');
}

function updateCurrentTeacher() {
    currentTeacherId = document.getElementById('currentTeacher').value;
    refreshScheduleView();
}

function getBreakTimes() {
    breaks = [];
    const breakCount = parseInt(document.getElementById('breakCount').value);
    
    for (let i = 0; i < breakCount; i++) {
        const startTime = document.getElementById(`breakStart${i}`).value;
        const duration = parseInt(document.getElementById(`breakDuration${i}`).value);
        
        breaks.push({
            start: startTime,
            duration: duration
        });
    }
    return breaks;
}

function isBreakTime(time) {
    return breaks.some(breakTime => {
        const breakStart = new Date(`2024-01-01 ${breakTime.start}`);
        const breakEnd = new Date(breakStart.getTime() + breakTime.duration * 60000);
        const currentTime = new Date(`2024-01-01 ${time}`);
        return currentTime >= breakStart && currentTime < breakEnd;
    });
}

function generateTimeSlots(startTime, endTime) {
    const classDuration = parseInt(document.getElementById('classDuration').value);
    let currentTime = new Date(`2024-01-01 ${startTime}`);
    const endDateTime = new Date(`2024-01-01 ${endTime}`);
    const slots = [];
    
    while (currentTime < endDateTime) {
        const timeString = currentTime.toTimeString().slice(0, 5);
        if (!isBreakTime(timeString)) {
            const timeSlot = formatTimeSlot(timeString, classDuration);
            slots.push(timeSlot);
            currentTime.setMinutes(currentTime.getMinutes() + classDuration);
        } else {
            slots.push('RECREIO');
            const currentBreak = breaks.find(b => {
                const breakStart = new Date(`2024-01-01 ${b.start}`);
                return currentTime >= breakStart;
            });
            currentTime.setMinutes(currentTime.getMinutes() + currentBreak.duration);
        }
    }
    
    return slots;
}

function generateSchedule() {
    getBreakTimes();
    const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
    let tableHTML = '<table><tr><th>Horário</th>';
    
    days.forEach(day => {
        tableHTML += `<th>${day}</th>`;
    });
    tableHTML += '</tr>';
    
    const shifts = [
        {
            name: 'Matutino',
            start: document.getElementById('startTimeMorning').value,
            end: document.getElementById('endTimeMorning').value
        },
        {
            name: 'Vespertino',
            start: document.getElementById('startTimeAfternoon').value,
            end: document.getElementById('endTimeAfternoon').value
        },
        {
            name: 'Noturno',
            start: document.getElementById('startTimeNight').value,
            end: document.getElementById('endTimeNight').value
        }
    ];

    shifts.forEach(shift => {
        tableHTML += `<tr><td colspan="${days.length + 1}" class="shift-header">${shift.name}</td></tr>`;
        const timeSlots = generateTimeSlots(shift.start, shift.end);
        
        timeSlots.forEach((time, i) => {
            tableHTML += `<tr>
                <td class="time-cell">${time}</td>`;
            
            if (time === 'RECREIO') {
                days.forEach(() => {
                    tableHTML += '<td class="break-cell">RECREIO</td>';
                });
            } else {
                days.forEach(day => {
                    const cellId = `${shift.name}-${day}-${i}`;
                    tableHTML += `<td class="editable" onclick="toggleMark('${cellId}')" id="${cellId}"></td>`;
                });
            }
            
            tableHTML += '</tr>';
        });
    });
    
    tableHTML += '</table>';
    document.getElementById('schedule-container').innerHTML = tableHTML;
    refreshScheduleView();
}

function refreshScheduleView() {
    document.querySelectorAll('.editable').forEach(cell => {
        cell.innerHTML = '';
        cell.classList.remove('resolved');
    });

    if (currentTeacherId) {
        const currentTeacher = teachers.find(t => t.id === currentTeacherId);
        Object.keys(teacherSchedules[currentTeacherId]).forEach(cellId => {
            const cell = document.getElementById(cellId);
            if (cell) {
                cell.innerHTML = `X<div class="teacher-info">${currentTeacher.subject}<br>${currentTeacher.name}</div>`;
            }
        });
    }
}

function toggleMark(cellId) {
    if (!currentTeacherId) {
        alert('Por favor, selecione um professor primeiro.');
        return;
    }

    const cell = document.getElementById(cellId);
    const currentTeacher = teachers.find(t => t.id === currentTeacherId);
    const currentContent = cell.innerHTML;

    if (!teacherSchedules[currentTeacherId][cellId]) {
        if (currentContent === '') {
            cell.innerHTML = `X<div class="teacher-info">${currentTeacher.subject}<br>${currentTeacher.name}</div>`;
            teacherSchedules[currentTeacherId][cellId] = true;
            currentTeacher.availableSlots = (currentTeacher.availableSlots || 0) + 1;
            updateTeachersList();
        }
    } else {
        cell.innerHTML = '';
        delete teacherSchedules[currentTeacherId][cellId];
        currentTeacher.availableSlots--;
        updateTeachersList();
    }
}

function checkConflicts() {
    const conflicts = [];
    const slots = {};

    teachers.forEach(teacher => {
        const teacherSlots = teacherSchedules[teacher.id];
        Object.keys(teacherSlots).forEach(slot => {
            if (!slots[slot]) {
                slots[slot] = [];
            }
            slots[slot].push(teacher);
        });
    });

    Object.entries(slots).forEach(([slot, teachersInSlot]) => {
        if (teachersInSlot.length > 1) {
            conflicts.push({
                slot,
                teachers: teachersInSlot
            });
        }
    });

    const suggestions = resolveConflicts(conflicts, slots);
    showSuggestions(suggestions);
    return suggestions;
}

function showSuggestions(suggestions) {
    const panel = document.getElementById('suggestions-panel');
    panel.innerHTML = `
        <h3>Sugestões de Resolução</h3>
        ${suggestions.map(sugg => `
            <div class="suggestion">
                <p><strong>${sugg.teacher}</strong>: ${sugg.message}</p>
                <p>Slots sugeridos: ${sugg.suggestedSlots.length}</p>
            </div>
        `).join('')}
    `;
    panel.classList.add('active');
}

function resolveConflicts(conflicts, slots) {
    finalSchedule = {};
    const suggestions = [];

    teachers.forEach(teacher => {
        const availableSlots = Object.keys(teacherSchedules[teacher.id]);
        const neededSlots = teacher.weeklyClasses;
        
        if (availableSlots.length > neededSlots) {
            const bestSlots = findBestSlots(availableSlots, slots, neededSlots, teacher);
            
            suggestions.push({
                teacher: teacher.name,
                message: `Reduzir de ${availableSlots.length} para ${neededSlots} slots`,
                suggestedSlots: bestSlots
            });

            bestSlots.forEach(slot => {
                finalSchedule[slot] = teacher;
            });
        } else if (availableSlots.length < neededSlots) {
            suggestions.push({
                teacher: teacher.name,
                message: `Atenção: Faltam ${neededSlots - availableSlots.length} slots para completar a carga horária`,
                suggestedSlots: availableSlots
            });
        } else {
            availableSlots.forEach(slot => {
                finalSchedule[slot] = teacher;
            });
        }
    });

    return suggestions;
}

function findBestSlots(availableSlots, allSlots, needed, teacher) {
    const slotScores = availableSlots.map(slot => ({
        slot,
        score: calculateSlotScore(slot, allSlots, teacher)
    }));

    slotScores.sort((a, b) => a.score - b.score);
    return slotScores.slice(0, needed).map(s => s.slot);
}

function calculateSlotScore(slot, allSlots, teacher) {
    let score = 0;
    
    if (allSlots[slot] && allSlots[slot].length > 1) {
        score += 10 * (allSlots[slot].length - 1);
    }

    const [shift, day, time] = slot.split('-');
    
    const adjacentSlots = [
        `${shift}-${day}-${parseInt(time) - 1}`,
        `${shift}-${day}-${parseInt(time) + 1}`
    ];

    adjacentSlots.forEach(adjSlot => {
        if (finalSchedule[adjSlot] && finalSchedule[adjSlot].id === teacher.id) {
            score += 5;
        }
    });

    const slotsInDay = Object.keys(finalSchedule).filter(s => 
        s.startsWith(`${shift}-${day}`) && 
        finalSchedule[s].id === teacher.id
    ).length;

    score += slotsInDay * 3;

    return score;
}

function applyResolvedSchedule() {
    document.querySelectorAll('.editable').forEach(cell => {
        cell.innerHTML = '';
        cell.classList.remove('resolved');
    });

    Object.entries(finalSchedule).forEach(([slot, teacher]) => {
        const cell = document.getElementById(slot);
        if (cell) {
            cell.innerHTML = `X<div class="teacher-info">${teacher.subject}<br>${teacher.name}</div>`;
            cell.classList.add('resolved');
        }
    });

    teachers.forEach(teacher => {
        teacher.availableSlots = Object.values(finalSchedule)
            .filter(t => t.id === teacher.id)
            .length;
    });
    updateTeachersList();
}

function generatePDF() {
    const scheduleContainer = document.getElementById('schedule-container');
    if (!scheduleContainer) {
        alert("A grade não foi gerada ainda.");
        return;
    }

    const { jsPDF } = window.jspdf;

    html2canvas(scheduleContainer, {
        scale: 3, // Aumenta a resolução para maior qualidade
        scrollX: 0,
        scrollY: 0,
        width: scheduleContainer.scrollWidth, // Captura a largura total do conteúdo
        height: scheduleContainer.scrollHeight, // Captura a altura total do conteúdo
        useCORS: true // Permitir imagens externas
    }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');

        const pdf = new jsPDF('landscape', 'mm', 'a4');

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const imgWidth = pdfWidth; // Ajustar a largura da imagem ao PDF
        const imgHeight = (canvas.height * pdfWidth) / canvas.width; // Manter a proporção da imagem

        let heightLeft = imgHeight;
        let position = 0;

        // Adicionar a imagem e dividir em páginas, se necessário
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;

        while (heightLeft > 0) {
            position -= pdfHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pdfHeight;
        }

        pdf.save('grade_horarios_completa.pdf');
    }).catch(error => {
        console.error("Erro ao gerar PDF:", error);
        alert("Erro ao gerar PDF. Verifique o console para mais detalhes.");
    });
}



// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    loadFromCache();
    updateBreakInputs();
    generateSchedule();
});
