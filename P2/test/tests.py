import unittest

def validate_request(data):
    """
    Función de validación principal basada en los requisitos RF-2 a RF-7.
    """
    # RF-4: Detección de Bots (Prioridad alta en validación)
    user_agent = data.get('user_agent', "").upper()
    bot_keywords = ["BOT", "SPIDER", "CRAWLER", "HERITRIX"]
    if any(keyword in user_agent for keyword in bot_keywords):
        return {"valid": False, "metric": "Bot detected"}

    # RF-2: Validación de método HTTP
    if data.get('method') != "GET":
        return {"valid": False, "metric": "Bad method"}

    # RF-3: Validación de código de estado
    status = data.get('status')
    if status is not None and status not in :
        return {"valid": False, "metric": "Bad status"}

    # RF-5: Validación de formato de archivo
    uri = data.get('uri_episode', "")
    if uri and not uri.lower().endswith(".mp3"):
        return {"valid": False, "metric": "Bad format resource"}

    # RF-7: Validación de umbrales de descarga (Generación de observaciones)
    bytes_count = data.get('bytes', 0)
    if status == 206:
        if bytes_count >= 1048576:
            return {"valid": True, "metric": "Download 206"}
    elif status == 200:
        if bytes_count >= 31457280:
            return {"valid": True, "metric": "Download 200"}

    return {"valid": False, "metric": "NA"}

class TestPodcastifyValidation(unittest.TestCase):
    """
    Suite de pruebas unitarias para validar los casos de prueba solicitados.
    """

    def test_cp_rf2_bad_method(self):
        # CP-RF2: Validación de método HTTP (POST no permitido)
        input_data = { "method": "POST", "uri_episode": "test.mp3" }
        result = validate_request(input_data)
        self.assertEqual(result["valid"], False)
        self.assertEqual(result["metric"], "Bad method")

    def test_cp_rf3_bad_status(self):
        # CP-RF3: Validación de código de estado (404 no permitido)
        input_data = { "method": "GET", "status": 404 }
        result = validate_request(input_data)
        self.assertEqual(result["valid"], False)
        self.assertEqual(result["metric"], "Bad status")

    def test_cp_rf4_bot_detection(self):
        # CP-RF4: Detección de Bots
        input_data = { "user_agent": "Google-CRAWLER/2.1", "method": "GET" }
        result = validate_request(input_data)
        self.assertEqual(result["valid"], False)
        self.assertEqual(result["metric"], "Bot detected")

    def test_cp_rf5_bad_format(self):
        # CP-RF5: Validación de formato MP3 (.wav no permitido)
        input_data = { "uri_episode": "audio/podcast1.wav", "method": "GET" }
        result = validate_request(input_data)
        self.assertEqual(result["valid"], False)
        self.assertEqual(result["metric"], "Bad format resource")

    def test_cp_rf7_206_threshold(self):
        # CP-RF7-206: Umbral de descarga petición parcial (206)
        input_data = { "status": 206, "bytes": 1048576, "id": "user123" }
        result = validate_request(input_data)
        self.assertEqual(result["valid"], True)
        self.assertEqual(result["metric"], "Download 206")

if __name__ == "__main__":
    unittest.main()
