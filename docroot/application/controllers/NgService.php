<?php 
header('Access-Control-Allow-Origin: *'); 
class NgService extends CI_Controller {
	function __construct() {
	        parent::__construct();
	        header('Access-Control-Allow-Origin: *');
	        header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
	        header('Access-Control-Allow-Methods: GET, POST, PUT');
	}

	public function index() {
		$getNgUsers = $this->model->getNgUsers();

		$data = array(
			'result' => $getNgUsers->result()
		);

		generate_json($data);
	}

	public function addUser() {
		$post = json_decode(file_get_contents("php://input"));
		$name = sanitize($post->name);
		$email = sanitize($post->email);

		$this->model->getNgAddUser($name, $email);

		$data = array(
			'result' => $post,
		);

		echo json_encode($data);
	}

	public function deleteUser() {
		$userId = json_decode(file_get_contents("php://input"));

		$getDeleteUser = $this->model->getDeleteUser($userId);

		$data = array(
			'success' => 1
		);

		echo json_encode($data);
	}

	public function editUser() {
		$post = json_decode(file_get_contents("php://input"));
		$id = sanitize($post->id);
		$name = sanitize($post->name);
		$email = sanitize($post->email);

		$this->model->getNgEditUser($name, $email, $id);

		$data = array(
			'result' => $post,
		);

		echo json_encode($data);
	}

	public function addFaqQuestion() {
		$post = json_decode(file_get_contents("php://input"));
		if ($post->question != null && $post->question != '') {
			$question 	= sanitize($post->question);
			$answer 	= sanitize($post->answer);
			$hide		= sanitize($post->hide);

			$getAddFaqQuestion = $this->model->getAddFaqQuestion($question, $answer, $hide);
		}
		$data = array(
			'result' => $post
		);

		generate_json($data);
	}

	public function loadFaqQuestion() {
		$getLoadFaqQuestion = $this->model->getLoadFaqQuestion();

		$data = array(
			'result' => $getLoadFaqQuestion->result()
		);

		generate_json($data);
	}

	public function removeFaqQuestion() {
		$post 	= json_decode(file_get_contents("php://input"));
		$id 	= sanitize($post->id);
		$getRemoveFaqQuestion = $this->model->getRemoveFaqQuestion($id);

		$data = array(
			'result' => $post
		);

		generate_json($data);
	}
}