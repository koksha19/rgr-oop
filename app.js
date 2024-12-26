import TableViewClass from './tableView.js';

const ID = 'table-container';
const tableView = new TableViewClass(ID);

const openFile = document.getElementById('open-file');
const saveFile = document.getElementById('save-file');
const saveAsFile = document.getElementById('save-as-file');

openFile.addEventListener('click', async () => {
    const file = await selectFile();
    if (file) {
        const data = await file.text();
        const rows = data.split('\n').map(row => row.split('\t'));
        tableView.loadTable(rows);
    }
});

saveFile.addEventListener('click', async () => {
    const fileName = prompt('Enter new file name:', 'table.txt');
    if (fileName) {
        downloadFile(fileName);
    }
});

saveAsFile.addEventListener('click', async () => {
    try {
        const newHandle = await window.showSaveFilePicker({
            suggestedName: 'table.txt',
        });
        const writableStream = await newHandle.createWritable();
        await writableStream.write(getContent());
        await writableStream.close();
    } catch (error) {
        console.error('File saving was canceled or failed:', error);
    }
});

const selectFile = () => {
    return new Promise(resolve => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.txt';
        input.addEventListener('change', () => resolve(input.files[0]));
        input.click();
    });
}

const downloadFile = (fileName) => {
    const blob = new Blob([getContent()], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
}

const getContent = () => {
    const headerRow = tableView.columnHeaders.join('\t');
    const dataRows = tableView.tableData
        .map(row => row.getRowValues().slice(1).join('\t'))
        .join('\n');
    return `${headerRow}\n${dataRows}`;
}