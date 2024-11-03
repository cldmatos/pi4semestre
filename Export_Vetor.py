import serial
import pandas as pd
import numpy as np
import statistics as st
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from datetime import datetime
from scipy import stats

# Configura a porta serial
try:
    ser = serial.Serial('COM6', 9600)
except Exception as e:
    print(f"Erro ao conectar na porta serial: {e}")

# Conecte ao MongoDB Atlas
uri = "mongodb+srv://claudiomatos:UcVJJeY2lMpu69Cm@arduino.hxqx1.mongodb.net/"

try:
    client = MongoClient(uri, server_api=ServerApi('1'))
    client.admin.command('ping')
    print("Conexão bem-sucedida com o MongoDB Atlas!")
    
    db = client['arduino']
    collection = db['medidas']
except Exception as e:
    print(f"Erro ao conectar ao MongoDB: {e}")
    collection = None

# Vetores para armazenar temperatura e umidade
temperaturas = []
umidades = []

# Loop para ler 90 registros da porta serial
for i in range(90):
    try:
        # Ler a linha de dados da serial
        data = ser.readline().decode('utf-8').strip()
        print(f"Dados recebidos: {data}")
        
        # Separar temperatura e umidade
        if ',' in data:
            temperatura, umidade = data.split(',')
            temperatura = float(temperatura)
            umidade = float(umidade)
            
            # Armazenar nos vetores
            temperaturas.append(temperatura)
            umidades.append(umidade)
        else:
            print("Formato de dados incorreto.")
    except Exception as e:
        print(f"Erro ao ler dados da serial: {e}")

print("--------------------------------------------------------------")
print("Leitura concluída. Estatísticas:")
# Implementar aqui os cálculos de estatísticas
#describeTemp = temperaturas.describe()

mediaTemp = round(np.mean(temperaturas).item(), 2)
medianaTemp = round(np.median(temperaturas).item(), 2)
modaTemp = round(float(st.mode(temperaturas)), 2)
desvioPTemp = round(np.std(temperaturas, ddof=1).item(), 2)
coeficienteVTemp = round((desvioPTemp / mediaTemp) * 100, 2)
assimetriaTemp = round(stats.skew(temperaturas).item(), 2)
curtoseTemp = round(stats.kurtosis(temperaturas).item(), 2)
print(f"Média Temperatura: {mediaTemp:.2f}")
print(f"Mediana Temperatura: {medianaTemp:.2f}")
print(f"Moda Temperatura: {modaTemp}")
print(f"Desvio padrão Temperatura: {desvioPTemp:.2f}")
print(f"Coeficiente de variação Temperatura: {coeficienteVTemp:.2f}%")
print(f"Assimetria Temperatura: {assimetriaTemp:.2f}")
print(f"Curtose Temperatura: {curtoseTemp:.2f}")
print("--------------------------------------------------------------")
#describeUmid =  umidades.describe()

mediaUmid = round(np.mean(umidades).item(), 2)
medianaUmid = round(np.median(umidades).item(), 2)
modaUmid = round(float(st.mode(umidades)), 2)
desvioPUmid = round(np.std(umidades, ddof=1).item(), 2)
coeficienteVUmid = round((desvioPUmid / mediaUmid) * 100, 2)
assimetriaUmid = round(stats.skew(umidades).item(), 2)
curtoseUmid = round(stats.kurtosis(umidades).item(), 2)
print(f"Média Umidade: {mediaUmid:.2f}")
print(f"Mediana Umidade: {medianaUmid:.2f}")
print(f"Moda Umidade: {modaUmid}")
print(f"Desvio padrão Umidade: {desvioPUmid:.2f}")
print(f"Coeficiente de variação Umidade: {coeficienteVUmid:.2f}%")
print(f"Assimetria Umidade: {assimetriaUmid:.2f}")
print(f"Curtose Umidade: {curtoseUmid:.2f}")
print("--------------------------------------------------------------")

# Finalizar aqui os cálculos (incluir variações de estatisticas no documento abaixo)

# Verificar se a coleção está disponível e salvar no MongoDB
if collection is not None:
    try:
        # Buscar o maior valor de id na coleção e incrementar
        ultimo_documento = collection.find_one(sort=[("id", -1)])  # Busca o documento com o maior id
        if ultimo_documento:
            novo_id = ultimo_documento['id'] + 1
        else:
            novo_id = 1  # Se a coleção estiver vazia, começa do id 1
                    
        # Criar um documento com as leituras e salvar no MongoDB
        documento = {
            "id": novo_id,
            "mediaTemp": mediaTemp,
            "medianaTemp": medianaTemp,
            "modaTemp": modaTemp,
            "desvioPTemp": desvioPTemp,
            "coeficienteVTemp": coeficienteVTemp,
            "assimetriaTemp": assimetriaTemp,
            "curtoseTemp": curtoseTemp,
            "mediaUmid": mediaUmid,
            "medianaUmid": medianaUmid,
            "modaUmid": modaUmid,
            "desvioPUmid": desvioPUmid,
            "coeficienteVUmid": coeficienteVUmid,
            "assimetriaUmid": assimetriaUmid,
            "curtoseUmid": curtoseUmid,
            "temperaturas": temperaturas,
            "umidades": umidades,
            "timestamp": datetime.now()
        }

        collection.insert_one(documento)
        print(f"Dados inseridos no MongoDB: {documento}")
    except Exception as e:
        print(f"Erro ao inserir dados no MongoDB: {e}")
else:
    print("Conexão com o MongoDB não foi estabelecida.")
