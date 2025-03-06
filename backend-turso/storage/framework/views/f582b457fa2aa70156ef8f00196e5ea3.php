<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte de Personas Registradas</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        body {
            background-color: #f5f5f5;
            color: #333;
            padding: 20px;
        }
        
        .container {
            max-width: 1000px;
            margin: 0 auto;
            background-color: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        header {
            margin-bottom: 30px;
            border-bottom: 1px solid #eee;
            padding-bottom: 20px;
        }
        
        h1 {
            color: #2c3e50;
            font-size: 24px;
            font-weight: 600;
        }
        
        .fecha-reporte {
            margin-top: 5px;
            color: #7f8c8d;
            font-size: 14px;
        }
        
        .info-resumen {
            display: flex;
            gap: 20px;
            margin-bottom: 20px;
        }
        
        .info-card {
            flex: 1;
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 6px;
            border-left: 4px solid #3498db;
        }
        
        .info-card h3 {
            font-size: 16px;
            margin-bottom: 5px;
        }
        
        .info-card p {
            font-size: 22px;
            font-weight: bold;
            color: #2c3e50;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            background-color: white;
        }
        
        thead {
            background-color: #3498db;
            color: white;
        }
        
        th {
            padding: 12px 15px;
            text-align: left;
            font-weight: 600;
        }
        
        td {
            padding: 10px 15px;
            border-bottom: 1px solid #eee;
        }
        
        tr:nth-child(even) {
            background-color: #f8f9fa;
        }
        
        tr:hover {
            background-color: #e9f7fe;
        }
        
        .footer {
            margin-top: 30px;
            text-align: right;
            font-size: 12px;
            color: #7f8c8d;
        }
        
        @media print {
            body {
                background-color: white;
                padding: 0;
            }
            
            .container {
                box-shadow: none;
                padding: 15px;
            }
            
            .info-card {
                border: 1px solid #ddd;
            }
        }
        
        @media screen and (max-width: 768px) {
            .info-resumen {
                flex-direction: column;
            }
            
            .container {
                padding: 15px;
            }
            
            table {
                font-size: 14px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>Reporte de Personas Registradas</h1>
            <p class="fecha-reporte">Generado el: <?php echo e(date('d/m/Y H:i')); ?></p>
        </header>
        
        <div class="info-resumen">
            <div class="info-card">
                <h3>Total Personas Registradas</h3>
                <p><?php echo e(count($personas)); ?></p>
            </div>
            <div class="info-card">
                <h3>Mes y Año</h3>
                <p><?php echo e(\Carbon\Carbon::create($year, $month, 1)->locale('es')->translatedFormat('F Y')); ?></p>
                        </div>
        </div>
        
        <table>
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Apellido Paterno</th>
                    <th>Apellido Materno</th>
                    <th>Correo</th>
                    <th>Fecha de Registro</th>
                </tr>
            </thead>
            <tbody>
                <?php $__currentLoopData = $personas; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $persona): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                    <tr>
                        <td><?php echo e($persona->nombre); ?></td>
                        <td><?php echo e($persona->apellido_paterno); ?></td>
                        <td><?php echo e($persona->apellido_materno); ?></td>
                        <td><?php echo e($persona->correo); ?></td>
                        <td><?php echo e(date('d/m/Y H:i', strtotime($persona->fecha_registro))); ?></td>
                        </tr>
                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
            </tbody>
        </table>
        
        <div class="footer">
            <p>Este reporte es generado automáticamente por el sistema.</p>
        </div>
    </div>
</body>
</html><?php /**PATH C:\laragon\www\Proyecto_Sistema_Biometrico\Proyecto_Sistema_Biometrico\backend-turso\resources\views/reportes/personas_registradas.blade.php ENDPATH**/ ?>